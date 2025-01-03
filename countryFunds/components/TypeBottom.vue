<template>
    <svg
      :class="['type-bottom', className]"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="path"
        d="M14 12C14 13.1046 13.1046 14 12 14L4 14C2.89543 14 2 13.1046 2 12L2 10L14 10L14 12Z"
        :fill="status?'#3782FF':'#1B1D1F'"
      />
      <rect class="rect" height="15" rx="3.5" stroke="#1B1D1F" width="15" x="0.5" y="0.5" />
    </svg>
  </template>
  
  <script>
  export default {
    name: "TypeBottom",
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
  