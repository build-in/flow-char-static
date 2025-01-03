<template>
    <svg
      :class="['type-left', className]"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="path" d="M2 4C2 2.89543 2.89543 2 4 2H7.5V9H2V4Z" :fill="status?'#3782FF':'#1B1D1F'" />
      <rect class="rect" height="15" rx="3.5" stroke="#1B1D1F" width="15" x="0.5" y="0.5" />
    </svg>
  </template>
  
  <script>
  export default {
    name: "TypeLeft",
    props: {
      className: {
        type: String,
        default: "",
      },
      status:{
        type: Boolean,
        default: false,
      }
    },
  };
  </script>
  
  <style>
  </style>
  