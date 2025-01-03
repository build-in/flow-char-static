<template>
    <div class="screen">
      <div class="frame">
        <img class="vector" alt="Vector" src="https://c.animaapp.com/qPNvqMCM/img/vector-36.svg" />
        <div class="text-wrapper">汇款币种为THB</div>
      </div>
      <div class="frame">
        <img class="vector" alt="Vector" src="https://c.animaapp.com/qPNvqMCM/img/vector-36-1.svg" />
        <div class="text-wrapper">汇款币种为USD</div>
      </div>
      <div class="div">
        <img class="vector" alt="Vector" src="https://c.animaapp.com/qPNvqMCM/img/vector-36-2.svg" />
        <div class="text-wrapper">跨币种兑换</div>
      </div>
      <div class="div">
        <img class="vector" alt="Vector" src="https://c.animaapp.com/qPNvqMCM/img/vector-36-3.svg" />
        <div class="text-wrapper">未走的资金流</div>
      </div>
      <img class="img" alt="Vector" src="https://c.animaapp.com/qPNvqMCM/img/vector-37.svg" />
      <div class="div">
        <div class="rectangle-wrapper">
          <div class="rectangle" />
        </div>
        <div class="text-wrapper-2">资金汇入</div>
      </div>
      <div class="div">
        <div class="frame-2" />
        <div class="text-wrapper-2">银行账户</div>
      </div>
      <div class="div">
        <div class="frame-3" />
        <div class="text-wrapper-2">银行账户（资金归集pool）</div>
      </div>
      <div class="div">
        <div class="div-wrapper">
          <div class="rectangle-2" />
        </div>
        <div class="text-wrapper-2">资金汇出</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Tips",
  };
  </script>
  
  <style>
  .screen {
    align-items: flex-start;
    background-color: rgba(255, 255, 255, 1);
    border-color: rgba(234, 234, 234, 1);
    border-top-style: solid;
    border-top-width: 1px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    position: relative;
  }
  
  .screen .frame {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex: 0 0 auto;
    gap: 16px;
    position: relative;
    width: 100%;
  }
  
  .screen .vector {
    height: 8.66px;
    position: relative;
    width: 64px;
  }
  
  .screen .text-wrapper {
    color: rgba(27, 29, 31, 1);
    font-family: "Poppins", Helvetica;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 0px;
    line-height: 14px;
    margin-top: -1px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
  }
  
  .screen .div {
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 16px;
    position: relative;
  }
  
  .screen .img {
    align-self: stretch;
    height: 1px;
    object-fit: cover;
    position: relative;
    width: 100%;
  }
  
  .screen .rectangle-wrapper {
    align-items: flex-end;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid;
    border-color:rgba(198, 200, 203, 1);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    height: 16px;
    overflow: hidden;
    position: relative;
    width: 64px;
  }
  
  .screen .rectangle {
    background-color:rgba(244, 68, 68, 1);
    height: 27px;
    position: relative;
    width: 8px;
  }
  
  .screen .text-wrapper-2 {
    color: rgba(27, 29, 31, 1);
    font-family: "Poppins", Helvetica;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 0px;
    line-height: 14px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
  }
  
  .screen .frame-2 {
    background-color: rgba(234, 234, 234, 1);
    border: 1px solid;
    border-color:rgba(198, 200, 203, 1);
    border-radius: 4px;
    height: 16px;
    position: relative;
    width: 64px;
  }
  
  .screen .frame-3 {
    background-color: rgba(250, 235, 236, 1);
    border: 1px solid;
    border-color:rgba(198, 200, 203, 1);
    border-radius: 4px;
    height: 16px;
    position: relative;
    width: 64px;
  }
  
  .screen .div-wrapper {
    align-items: flex-start;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid;
    border-color:rgba(198, 200, 203, 1);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    height: 16px;
    overflow: hidden;
    position: relative;
    width: 64px;
  }
  
  .screen .rectangle-2 {
    background-color: rgba(55, 130, 255, 1);
    height: 27px;
    position: relative;
    width: 8px;
  }
  </style>
  