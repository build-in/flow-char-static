import { Graph, Node, Path, Edge, Dom, Platform, StringExt } from '@antv/x6';
import { register } from '@antv/x6-vue-shape';
import DataProcessingDagNode from './dataProcessingDagNode.vue';
import DataInflowNode from './inflowNode.vue';
import { bottom } from '@antv/x6/lib/registry/port-layout/line';
import { head } from 'lodash';
import close from '@/assets/close.png';

// 在画布上注册图形
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
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          // stroke: 'transparent',
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
    connector: { name: 'curveConnector' },
    router: {
      name: 'orth'
    },
    attrs: {
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
    height: 60,
    component: DataProcessingDagNode,
    // port默认不可见
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
    },
    attrs: {
      btn: {
        refX: '100%',
        refX2: -28,
        y: 4,
        width: 24,
        height: 24,
        rx: 10,
        ry: 10,
        fill: 'rgba(255,255,0,0.01)',
        stroke: 'red',
        cursor: 'pointer',
        event: 'node:delete',
      },
      btnText: {
        fontSize: 14,
        fill: 'red',
        text: 'delete',
        refX: '100%',
        refX2: 19,
        y: -17,
        x: 10,
        cursor: 'pointer',
        pointerEvent: 'none',
      },
      image: {
        'xlink:href': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
        width: 24,
        height: 24,
        refX: '100%',
        refX2: -28,
        y: -10,
        rx: 10,
        ry: 10,
        cursor: 'pointer',
        event: 'node:delete',
      },
    },
  });

  Graph.unregisterNode('funds-payin-payout-node');
  Graph.registerNode('funds-payin-payout-node', {
    inherit: 'rect',
    width: 160,
    height: 60,
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
      // {
      //   tagName: 'g',
      //   children: [
      //     {
      //       tagName: 'rect',
      //       selector: 'btn',
      //     },
      //     {
      //       tagName: 'text',
      //       selector: 'btnText',
      //     },
      //   ],
      // },
      {
        tagName: 'image',
        selector: 'image',
      },
    ],
    attrs: {
      body: {
        stroke: '#5F95FF',
        strokeWidth: 1,
        fill: '#ffffff',
      },
      text: {
        fontSize: 12,
        fill: '#080808',
      },
      btn: {
        refX: '100%',
        refX2: -28,
        y: 4,
        width: 24,
        height: 24,
        rx: 10,
        ry: 10,
        fill: 'rgba(255,255,0,0.01)',
        stroke: 'red',
        cursor: 'pointer',
        event: 'node:delete',
        marginLeft: 20
      },
      btnText: {
        fontSize: 14,
        fill: 'red',
        text: 'delete',
        refX: '100%',
        refX2: 19,
        y: -17,
        x: 10,
        cursor: 'pointer',
        pointerEvent: 'none',
      },
      image: {
        'xlink:href': close,
        width: 20,
        height: 20,
        refX: '100%',
        refX2: -28,
        x: 17,
        y: -10,
        rx: 10,
        ry: 10,
        cursor: 'pointer',
        event: 'node:delete',
      },
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
      },
      items: [
        {
          id: 'funds-payin-payout-node-left1',
          group: 'left',
        },
        {
          id: 'funds-payin-payout-node-left2',
          group: 'left',
        },
        {
          id: 'funds-payin-payout-node-left3',
          group: 'left',
        },
        {
          id: 'funds-payin-payout-node-right1',
          group: 'right'
        },
        {
          id: 'funds-payin-payout-node-right2',
          group: 'right'
        },
        {
          id: 'funds-payin-payout-node-right3',
          group: 'right'
        },
        {
          id: 'funds-payin-payout-node-top1',
          group: 'top'
        },
        {
          id: 'funds-payin-payout-node-top2',
          group: 'top'
        },
        {
          id: 'funds-payin-payout-node-top3',
          group: 'top'
        },
        {
          id: 'funds-payin-payout-node-bottom1',
          group: 'bottom'
        },
        {
          id: 'funds-payin-payout-node-bottom2',
          group: 'bottom'
        },
        {
          id: 'funds-payin-payout-node-bottom3',
          group: 'bottom'
        },
      ],
    },
  }, true);
  // Graph.registerNode('haoren', {
  //   width: 100,
  //   height: 50,
  //   attrs: {
  //     label: {
  //       fontSize: 12,
  //       text: '特殊接点',
  //     }
  //   }
  // });
}

export function stencilData(graph) {
  const r1 = graph.createNode({
    shape: 'funds-payin-payout-node',
    attrs: {
      label: {
        text: '资金流入',
        type: 'payinFlow',
      },
    }
  });
  const r2 = graph.createNode({
    shape: 'funds-payin-payout-node',
    attrs: {
      label: {
        text: '资金流出',
        type: 'payoutFlow',
      },
    }
  });
  const r3 = graph.createNode({
    shape: 'data-processing-dag-node',
    attrs: {
      label: {
        text: '银行账户',
        type: 'bankAccount',
      },
    },
    data: {
      accountId: 'DBSHK01_001220363_HK_USD',
      accountType: 'BANK',
      contractEntity: 'PMMax',
      institutionAlias: 'DBSHK01',
      country: 'HK',
      currency: 'USD',
      accountNo: '001220363'
    }
  });
  return [r1, r2, r3];
}

export function stencilCombData(graph) {
  // const node1 = graph.createNode({
  //   shape: 'haoren',
  //   attrs: {
  //     label: {
  //       text: '特殊接点',
  //       type: 'payinFlow',
  //     },
  //   }
  // });
  const node2 = graph.createNode({
    shape: 'data-processing-dag-node',
    attrs: {
      label: {
        text: 'VIP账户',
        type: 'VIPAccount',
      },
    },
    data: {
      accountId: 'DBSHK01_001220363_HK_USD',
      accountType: 'BANK',
      contractEntity: 'PMMax',
      institutionAlias: 'DBSHK01',
      country: 'HK',
      currency: 'USD',
      accountNo: '001220363'
    }
  });
  return [node2];
}

