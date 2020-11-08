const router = require("express").Router();
const path = require("path");
const parseRange = require("range-parser");
const torrentStream = require("torrent-stream");
const _ = require("lodash");
const fs = require("fs-extra");
const MovieWatched = require("../Models/WtchedMovie");
const ffmpegInstdataer = require("@ffmpeg-installer/ffmpeg");
const FFmpeg = require("fluent-ffmpeg");
FFmpeg.setFfmpegPath(ffmpegInstdataer.path);
const Movie = require("../Models/MovieCheck");
let engs = [];
let tr = [
  "udp://open.demonii.com:1337/announce",
  "udp://tracker.openbittorrent.com:80",
  "udp://tracker.coppersurfer.tk:6969",
  "udp://glotorrents.pw:6969/announce",
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://torrent.gresille.org:80/announce",
  "udp://p4p.arenabg.com:1337",
  "udp://tracker.leechers-paradise.org:6969",
  "udp://p4p.arenabg.ch:1337",
  "udp://tracker.internetwarriors.net:1337"
];

const convertFile = file => {
  try {
    const convertedFile = new FFmpeg(file.createReadStream())
      .videoCodec("libvpx")
      .audioCodec("libvorbis")
      .format("webm")
      .audioBitrate(128)
      .videoBitrate(8000)
      .outputOptions([`-threads 5`, "-deadline realtime", "-error-resilient 1"])
      .on("error", err => {});
    return convertedFile;
  } catch (err) {
    return file.createReadStream();
  }
};
const needToConvert = ext => {
  if (ext === "mp4" || ext === "webm") return false;
  else return true;
};
function delfilm(hash) {
  const filmData = {
    hash: hash,
    time: Date.now()
  };
  Movie.findOne({
    hash: hash
  }).then(async film => {
    if (!film) {
     Movie.create(filmData);
    } else {
      Movie.find({}).then(async data => {
        var i = 0;
        while (i < data.length) {
          let rest = Date.now() - data[i].DateWatched;

          rest = rest / (1000 * 60 * 60 * 24);
          if (rest >= 30) {
            try {
              let file = `./src/MoviesHash/torrent-stream/${data[i].hash}`;
               Movie.findOneAndRemove({ hash: data[i].hash });
               fs.remove(file).then(() => {
                fs.remove(
                  `./src/MoviesHash/torrent-stream/${data[i].hash}.torrent`
                );
              });
            } catch (err) {
              console.log("cant" + err);
            }
          }
          i++;
        }
      });
    }
  });
}

const updateDate = hash => {
  Movie.findOne({
    hash: hash
  }).then(data => {
    Movie.updateOne({ hash: hash }, { $set: { DateWatched: Date.now() } });
  });
};

const getTorrentFile = hash => {
  delfilm(hash);

  let engine = torrentStream("magnet:?xt=urn:btih:" + hash, {
    tmp: "./src/MoviesHash",
    trackers: tr
  });
  return new Promise(async (resolve, reject) => {
    let b = _.find(engs, { hash: hash });
    if (typeof b === "object") {
      engine = b.engine;
      engine.files.forEach(function(file, idx) {
        const ext = path.extname(file.name).slice(1);

        if (
          ext === "mkv" ||
          ext === "mp4" ||
          ext === "flv" ||
          ext === "webm" ||
          ext === "wmv" ||
          ext === "vob" ||
          ext === "avi" ||
          ext === "mov"
        ) {
          updateDate(hash);
          resolve(file);
        }
      });
    } else {
      engine.on("ready", function() {
        engine.files.forEach(function(file, idx) {
          const ext = path.extname(file.name).slice(1);

          if (
            ext === "mkv" ||
            ext === "mp4" ||
            ext === "flv" ||
            ext === "webm" ||
            ext === "wmv" ||
            ext === "vob" ||
            ext === "avi" ||
            ext === "mov"
          ) {
            engs.push({ engine, hash });
            file.ext = ext;
            resolve(file);
          }
        });
      });
    }
  });
};

router.get("/video/:hash/:id", function(req, res) {
  const hash = req.params.hash;
  const id = req.params.id;
  if (hash && req.method == "GET") {
    // 79816060EA56D56F2A2148CD45705511079F9BCA
    getTorrentFile(hash)
      .then(file => {
        MovieWatched.findOne({
          imdbID: id
        }).then(async film => {
          if (!film) {
            await MovieWatched.create({ imdbID: id });
          }
        });
        const conv = needToConvert(file.ext);
        console.log(conv);
        if (conv === false) {
          res.setHeader("Content-Length", file.length);
          res.setHeader("Content-Type", `video/${file.ext}`);
          const ranges = parseRange(file.length, req.headers.range, {
            combine: true
          });
          if (ranges == -1) {
            res.statusCode = 416;
            return res.end();
          } else if (
            ranges === -2 ||
            ranges.type !== "bytes" ||
            ranges.length > 1
          ) {
            return file.createStream().pipe(res);
          } else {
            const range = ranges[0];
            res.statusCode = 206;
            res.setHeader("Accept-Ranges", "bytes");
            res.setHeader("Content-Length", 1 + range.end - range.start);
            res.setHeader(
              "Content-Range",
              `bytes ${range.start}-${range.end}/${file.length}`
            );
            return file.createReadStream(range).pipe(res);
          }
        } else {
          convertFile(file).pipe(res);
        }
      })
      .catch(err => {
        res.end(err);
      });
  }
});

module.exports = router;
