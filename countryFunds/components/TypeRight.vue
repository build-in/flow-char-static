<template>
    <svg
      :class="['type-right', className]"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="path" d="M14 9L8.5 9L8.5 2L12 2C13.1046 2 14 2.89543 14 4L14 9Z" :fill="status?'#3782FF':'#1B1D1F'" />
      <rect class="rect" height="15" rx="3.5" stroke="#1B1D1F" width="15" x="0.5" y="0.5" />
    </svg>
  </template>
  
  <script>
  export default {
    name: "TypeRight",
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
  /* No styles */
  </style>
  