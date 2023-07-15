<template>
  <el-carousel indicator-position="outside" height="850px">
    <el-carousel-item v-for="item in imgList" :key="item">
      <h3>{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      imgList: [
        "",
        " "
      ]
    };
  },
  methods: {

  }
};
</script>

<style scoped lang="scss">
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}</style>

