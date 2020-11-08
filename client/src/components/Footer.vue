<template>
  <div>
    <v-footer color="#0E0E0E" app height="110">
      <v-row justify="center">
        <v-col class="black darken-4 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>HyperTube</strong>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      links: [
        { link: "/", name: "Home" },
        { link: "/about", name: "About Us" },
        { link: "/team", name: "Team" },
        { link: "/services", name: "Services" },
        { link: "/blog", name: "Blog" },
        { link: "/contactus", name: "Contact Us" }
      ]
    };
  }
};
</script>