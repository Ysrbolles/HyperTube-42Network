<template></template>

<script>
export default {
  name: "MovieCard",
  props: ["movie"],
  data() {
    return {};
  },
  methods: {
    Watch() {}
  },
  created() {}
};
</script>

<style scoped>
.card {
  color: aliceblue;
  border-radius: 15px !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.box1 img,
.box1:after,
.box1:before {
  width: 100%;
  transition: all 0.3s ease 0s;
}
.box1 .icon {
  text-align: center;
}
.box1 .title {
  letter-spacing: 1px;
}
.box1 .icon,
.box1 .title,
.box1 .movie {
  margin: 0;
  position: absolute;
}
.box1 {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  padding: 0;
  position: relative;
  overflow: hidden;
}
.box1:after,
.box1:before {
  height: 50%;
  content: "";
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform-origin: 100% 0;
  transform: rotateZ(90deg);
}
.box1:after {
  top: auto;
  bottom: 0;
  transform-origin: 0 100%;
}
.box1:hover:after,
.box1:hover:before {
  transform: rotateZ(0);
}
.box1 img {
  height: auto;
  transform: scale(1) rotate(0);
}
.box1:hover img {
  filter: sepia(80%);
  transform: scale(1.3) rotate(10deg);
}
.box1 .title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 1px #004cbf;
  bottom: 0px;
  opacity: 0;
  z-index: 2;
  transform: scale(0);
  transition: all 0.5s ease 0.2s;
}
.box1 .title p {
  margin: 0;
}
.box1:hover .title {
  opacity: 1;
  transform: scale(0.7);
}
.box1 .icon {
  padding: 7px 5px;
  list-style: none;
  background: #fff;
  border-radius: 0 0 0 10px;
  top: -100%;
  right: 0;
  z-index: 2;
  transition: all 0.3s ease 0.2s;
}
.box1 .movie {
  padding: 7px 5px;
  color: #004cbf;
  background: #fff;

  top: -100%;

  z-index: 2;
  transition: all 0.3s ease 0.2s;
}
.box1:hover .icon {
  top: 0;
}
.box1 .icon li {
  display: block;
  margin: 10px 0;
}
@media only screen and (max-width: 990px) {
  .box1 {
    margin-bottom: 30px;
  }
}
.btn-outline-warning:hover {
  color: white;
}
</style>