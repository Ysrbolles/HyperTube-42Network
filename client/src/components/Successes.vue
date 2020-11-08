<template>
  <div class="success alert-success">{{ msg }}</div>
</template>

<script>
export default {
  props: ["msg"]
};
</script>

<style scoped>
.alert {
  border-radius: 0px;
}
.alert-danger {
  background: red;
  color: #fff;
}
</style>