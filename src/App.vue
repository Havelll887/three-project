<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>

export default {
    name: 'App',
}
</script>

<style>
/* 引入公共样式 */
@import url('./common/css/common.css');

* {
    margin: 0;
    padding: 0;
    /* height: 100%;
    width: 100%; */
    /* overflow: hidden; */
    box-sizing: border-box;
}

a {
    text-decoration: none;
}
</style>
