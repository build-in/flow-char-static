<template>
    <svg
      :class="['arrow-down', className]"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="path"
        d="M2.24861 5.49519C2.50896 5.23484 2.93107 5.23484 3.19142 5.49519L7.53808 9.84186C7.79107 10.0948 8.20896 10.0948 8.46194 9.84186L12.8086 5.49519C13.069 5.23484 13.4911 5.23484 13.7514 5.49519C14.0118 5.75554 14.0118 6.17765 13.7514 6.438L9.40475 10.7847C8.63107 11.5583 7.36896 11.5583 6.59527 10.7847L2.24861 6.438C1.98826 6.17765 1.98826 5.75554 2.24861 5.49519Z"
        fill="#1B1D1F"
      />
    </svg>
  </template>
  
  <script>
  export default {
    name: "ArrowDown",
    props: {
      className: {
        type: String,
        default: "",
      },
    },
  };
  </script>
  
  <style>
  </style>
  