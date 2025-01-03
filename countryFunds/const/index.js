export function deleteNode(name) {
  const deleteNodes = document.querySelectorAll(`.${name}`);
  // 遍历并删除每个节点
  deleteNodes.forEach(function(node) {
    // 检查节点是否确实存在于DOM中（以防它在循环中被删除）
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
}

export function hasInDetail() {
  const pattern = /countryFunds\/detail/;
  if (pattern.test(window.location.href)) {
    return false;
  } else {
    return true;
  }
}

export const real_time = [
  { value: 1, lable: 'Real Time' },
  { value: 2, lable: 'T+0' },
  { value: 3, lable: 'T+1' },
  { value: 4, lable: 'T+2' },
  { value: 5, lable: 'T+3' },
  { value: 6, lable: 'T+4' },
  { value: 7, lable: 'T+5' },
  { value: 8, lable: 'T+6' },
  { value: 9, lable: 'T+7' },
  { value: 10, lable: 'T+15' },
  { value: 11, lable: 'T+30' },
];

export const line_type = [
  { value: 'lcy', lable: 'LCY' },
  { value: 'usd', lable: 'USD' },
  { value: 'crossCurrency', lable: '跨币种' },
  { value: 'dottedLine', lable: '虚线' },
];

export const rectangle_color = [
  { value: '#A9DDF5', lable: '青色' },
  { value: '#D9B7FB', lable: '紫色' },
  { value: '#F9DAA0', lable: '黄色' },
  { value: '#B0E4C8', lable: '绿色' },
  { value: '#FFB8BB', lable: '红色' },
  { value: '#A4C6FF', lable: '蓝色' },

  { value: '#E2B18B', lable: '棕色' },
  { value: '#AAAAAA', lable: '灰色' },
  { value: '#FFAE6B', lable: '橙色' },
  { value: '#FFC4E8', lable: '粉色' },
  { value: '#B3B7F8', lable: '靛青' },
  { value: '#A8D290', lable: '草绿' },
];

export const line_color = [
  { value: '#59B4D1', lable: '青色' },
  { value: '#9E57E5', lable: '紫色' },
  { value: '#FB9701', lable: '黄色' },
  { value: '#00C352', lable: '绿色' },
  { value: '#F44444', lable: '红色' },
  { value: '#3782FF', lable: '蓝色' },

  { value: '#803903', lable: '棕色' },
  { value: '#33312F', lable: '灰色' },
  { value: '#FF7D12', lable: '橙色' },
  { value: '#E91C9A', lable: '粉色' },
  { value: '#2E2DF7', lable: '靛青' },
  { value: '#74CB16', lable: '草绿' },
];

export const line_tooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'cross',
    crossStyle: {
      color: '#999'
    }
  }
};

export const line_scale_rules = [
  { maxAmount: '999999999999', min: '100000000000' },
  { maxAmount: '99999999999', min: '10000000000' },
  { maxAmount: '9999999999', min: '1000000000' },
  { maxAmount: '999999999', min: '100000000' },
  { maxAmount: '99999999', min: '10000000' },
  { maxAmount: '9999999', min: '1000000' },
  { maxAmount: '999999', min: '100000' },
  { maxAmount: '99999', min: '10000' },
  { maxAmount: '9999', min: '1000' },
  { maxAmount: '999', min: '100' },
  { maxAmount: '99', min: '10' },
  { maxAmount: '9', min: '1' }
];

export const table_behavier_rules = [
  { table_role: 'CHANNEL_CLEARING_RECEIVABLES_NEW', table_select: 'sumTpvAmount' },
  { table_role: 'CHANNEL_TOP_UP_NEW', table_select: 'sumRechargeAmount' },
  { table_role: 'VA_RECEIVABLES_NEW', table_select: 'sumVaReceivedAmount' },
  { table_role: 'FUNDS_REPLACE_SEND_NEW', table_select: 'sumSendAmount' },
  { table_role: 'SETTLEMENT_FUNDS_NEW', table_select: 'sumSettlementFundsAmount' },
];

export const get_url_params = (name) => {
  const arbitraryUrl = window.location.href;
  return new URLSearchParams(new URL(arbitraryUrl).search).get(name);
};

export const get_default_table = [
  'ACCOUNT_BALANCE_CHANGES',
  'BUSINESS_TYPE_FLOW_NETTING',
  'CHANNEL_CLEARING_RECEIVABLES',
  'CHANNEL_TOP_UP',
  'FUNDS_REPLACE_SEND',
  'SETTLEMENT_FUNDS',
  'VA_RECEIVABLES',
];
// 是否在详情页
export const currentRoutePath = () => {
  return !!window.location.href.includes('countryFunds/detail');
};