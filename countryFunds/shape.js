import { Graph, Path, Edge } from '@antv/x6';
import { register } from '@antv/x6-vue-shape';
import DataProcessingDagNode from './dataProcessingDagNode.vue';
import DataInflowNode from './inflowNode.vue';
import DataOutflowNode from './outflowNode.vue';
import DataExchangeNode from './exchangeNode.vue';

export function initShape() {
  // 注册连接器
  Graph.registerConnector(
    'curveConnector',
    (sourcePoint, targetPoint) => {
      const hgap = Math.abs(targetPoint.x - sourcePoint.x);
      const path = new Path();
      path.appendSegment(
        Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y),
      );
      path.appendSegment(
        Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y),
      );
      // 水平三阶贝塞尔曲线
      path.appendSegment(
        Path.createSegment(
          'C',
          sourcePoint.x < targetPoint.x
            ? sourcePoint.x + hgap / 2
            : sourcePoint.x - hgap / 2,
          sourcePoint.y,
          sourcePoint.x < targetPoint.x
            ? targetPoint.x - hgap / 2
            : targetPoint.x + hgap / 2,
          targetPoint.y,
          targetPoint.x - 6,
          targetPoint.y,
        ),
      );
      path.appendSegment(
        Path.createSegment('L', targetPoint.x + 2, targetPoint.y),
      );
      return path.serialize();
    },
    true,
  );

  // 注册边
  Edge.config({
    router: {
      name: 'orth'
    },
    connector: { name: 'curveConnector' },
    vertices: [ // 设置偏移量，重绘是防止重叠
      { x: 100, y: 200 },
      { x: 300, y: 120 },
    ],
    markup: [
      {
        tagName: 'path', // 标签
        selector: 'wrap', // 选择器
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
    ],
    attrs: {
      // 使用选择器模式
      wrap: {
        connection: true,
        strokeWidth: 10,
        strokeLinejoin: 'round',
      },
      line: {
        connection: true,
        stroke: '#A2B1C3',
        strokeWidth: 1,
        targetMarker: {
          name: 'classic',
          size: 6,
        },
      },
    },
  });

  Graph.registerEdge('data-processing-curve', Edge, true);

  // 注册银行卡片节点
  register({
    shape: 'data-processing-dag-node',
    width: 180,
    height: 80,
    component: DataProcessingDagNode,
    ports: {
      groups: {
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
      },
      items: [
        {
          id: 'data-processing-dag-node-port-left1',
          group: 'left',
        },
        {
          id: 'data-processing-dag-node-port-left2',
          group: 'left',
        },
        {
          id: 'data-processing-dag-node-port-left3',
          group: 'left',
        },
        {
          id: 'data-processing-dag-node-port-right1',
          group: 'right'
        },
        {
          id: 'data-processing-dag-node-port-right2',
          group: 'right'
        },
        {
          id: 'data-processing-dag-node-port-right3',
          group: 'right'
        },
        {
          id: 'data-processing-dag-node-port-top1',
          group: 'top'
        },
        {
          id: 'data-processing-dag-node-port-top2',
          group: 'top'
        },
        {
          id: 'data-processing-dag-node-port-top3',
          group: 'top'
        },
        {
          id: 'data-processing-dag-node-port-bottom1',
          group: 'bottom'
        },
        {
          id: 'data-processing-dag-node-port-bottom2',
          group: 'bottom'
        },
        {
          id: 'data-processing-dag-node-port-bottom3',
          group: 'bottom'
        },
      ],
    }
  });

  // 注册流入节点
  register({
    shape: 'data-inflow-node',
    width: 180,
    height: 60,
    component: DataInflowNode,
    ports: {
      groups: {
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
      },
      items: [
        {
          id: 'data-inflow-node-left1',
          group: 'left',
        },
        {
          id: 'data-inflow-node-left2',
          group: 'left',
        },
        {
          id: 'data-inflow-node-left3',
          group: 'left',
        },
        {
          id: 'data-inflow-node-right1',
          group: 'right'
        },
        {
          id: 'data-inflow-node-right2',
          group: 'right'
        },
        {
          id: 'data-inflow-node-right3',
          group: 'right'
        },
        {
          id: 'data-inflow-node-top1',
          group: 'top'
        },
        {
          id: 'data-inflow-node-top2',
          group: 'top'
        },
        {
          id: 'data-inflow-node-top3',
          group: 'top'
        },
        {
          id: 'data-inflow-node-bottom1',
          group: 'bottom'
        },
        {
          id: 'data-inflow-node-bottom2',
          group: 'bottom'
        },
        {
          id: 'data-inflow-node-bottom3',
          group: 'bottom'
        },
      ],
    }
  });

  // 注册流出节点
  register({
    shape: 'data-outflow-node',
    width: 180,
    height: 60,
    component: DataOutflowNode,
    ports: {
      groups: {
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
      },
      items: [
        {
          id: 'data-outflow-node-left1',
          group: 'left',
        },
        {
          id: 'data-outflow-node-left2',
          group: 'left',
        },
        {
          id: 'data-outflow-node-left3',
          group: 'left',
        },
        {
          id: 'data-outflow-node-right1',
          group: 'right'
        },
        {
          id: 'data-outflow-node-right2',
          group: 'right'
        },
        {
          id: 'data-outflow-node-right3',
          group: 'right'
        },
        {
          id: 'data-outflow-node-top1',
          group: 'top'
        },
        {
          id: 'data-outflow-node-top2',
          group: 'top'
        },
        {
          id: 'data-outflow-node-top3',
          group: 'top'
        },
        {
          id: 'data-outflow-node-bottom1',
          group: 'bottom'
        },
        {
          id: 'data-outflow-node-bottom2',
          group: 'bottom'
        },
        {
          id: 'data-outflow-node-bottom3',
          group: 'bottom'
        },
      ],
    }
  });

  // 注册兑换卡片
  register({
    shape: 'data-exchange-node',
    width: 180,
    height: 60,
    component: DataExchangeNode,
    ports: {
      groups: {
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#c8e1ff',
              strokeWidth: 1,
              fill: 'transparent',
            },
          },
        },
      },
      items: [
        {
          id: 'data-exchange-node-left1',
          group: 'left',
        },
        {
          id: 'data-exchange-node-left2',
          group: 'left',
        },
        {
          id: 'data-exchange-node-left3',
          group: 'left',
        },
        {
          id: 'data-exchange-node-right1',
          group: 'right'
        },
        {
          id: 'data-exchange-node-right2',
          group: 'right'
        },
        {
          id: 'data-exchange-node-right3',
          group: 'right'
        },
        {
          id: 'data-exchange-node-top1',
          group: 'top'
        },
        {
          id: 'data-exchange-node-top2',
          group: 'top'
        },
        {
          id: 'data-exchange-node-top3',
          group: 'top'
        },
        {
          id: 'data-exchange-node-bottom1',
          group: 'bottom'
        },
        {
          id: 'data-exchange-node-bottom2',
          group: 'bottom'
        },
        {
          id: 'data-exchange-node-bottom3',
          group: 'bottom'
        },
      ],
    }
  });
}

export function stencilData(graph) {
  const bank = graph.createNode({
    shape: 'data-processing-dag-node',
    attrs: {
      label: {
        text: '银行账户',
        type: 'bankAccount',
      },
    },
    data: {
      accountId: '',
      accountType: '',
      contractEntity: '',
      institutionAlias: '',
      country: '',
      currency: '',
      accountNo: '',
      flowFundsChart: '',
      fundTrendChart: '',
      checkSuccess: 'default',
    }
  });

  const payin = graph.createNode({
    shape: 'data-inflow-node',
    attrs: {
      label: {
        text: '资金流入',
        type: 'payInFlowNew',
      },
    },
    data: {
      channelName: '',
      subjectContract: '',
      businessType: '',
      transferCurrency: '',
      flowFundsChart: '',
      fundTrendChart: '',
      checkSuccess: 'default',
    }
  });

  const payout = graph.createNode({
    shape: 'data-outflow-node',
    attrs: {
      label: {
        text: '资金流出',
        type: 'payOutFlowNew',
      },
    },
    data: {
      channelName: '',
      subjectContract: '',
      businessType: '',
      transferCurrency: '',
      flowFundsChart: '',
      fundTrendChart: '',
      checkSuccess: 'default',
    }
  });

  const exchange = graph.createNode({
    shape: 'data-exchange-node',
    attrs: {
      label: {
        text: '兑换卡片',
        type: 'exchangeCard',
      },
    },
    data: {
      institutionName: '',
      checkSuccess: 'default',
    }
  });

  // const defalutLine = graph.addEdge({
  //   shape: 'data-processing-curve',
  //   attrs: {
  //     line: {
  //       stroke: '#7c68fc', // 指定 path 元素的填充色
  //     },
  //   },
  // });

  return [payin, payout, bank, exchange];
}