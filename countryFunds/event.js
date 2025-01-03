import { FunctionExt } from '@antv/x6';

export function initEvent(graph, container) {
  graph.on('node:delete', ({ view, e }) => {
    e.stopPropagation();
    view.cell.remove();
  });
  graph.bindKey('delete', () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
  });

  graph.on('node:mouseenter', FunctionExt.debounce((e, node, view) => {
    // e.stopPropagation();
    // 设置连接桩
    // console.log(e, 'e', e.cell.id, 'e.id', node, 'node');
    const ports = container.querySelectorAll('.x6-port-body');
    showPorts(ports, true);
    // 设置 删除按钮出现
    // const node = graph.findById('nodeId');
    // const node = e.node;
    // node.setAttr('image').width = 0; // 如果你的label属性是一个对象，并包含text属性
    // const node = graph.findById(e.node.id);
    // node.attr({
    //   image: {
    //     event: 'node:delete',
    //     xlinkHref: '',
    //     width: 0,
    //     height: 0,
    //   },
    // });
    // console.log(node, 'node', e);
    // e.node.store.data.attrs.image.width = 0;
    // e.node.store.data.attrs.image.height = 0;
    // node.attr('image/width', 0);
  }), 500);

  graph.on('node:mouseleave', FunctionExt.debounce((e, node, view) => {
    // e.stopPropagation();
    const ports = container.querySelectorAll('.x6-port-body');
    showPorts(ports, false);
    // 设置 删除按钮隐藏
    // e.node.store.data.attrs.image.width = 24;
    // e.node.store.data.attrs.image.height = 24;
    // node.attr({
    //   image: {
    //     event: 'node:delete',
    //     xlinkHref: '',
    //     width: 24,
    //     height: 24,
    //   },
    // });
  }), 500);

  graph.on('edge:mouseenter', ({ e, edge, view }) => {
    // alert(666);
    // const line = edge.attr('line');
    // line.stroke = 'red';
    // line['stroke - width'] = 4;
    // edge.attr('line', line);
  });

  graph.on('edge:mouseleave', ({ e, edge, view }) => {
    // alert(777);
    // const line = edge.attr('line');
    // line.stroke = 'black';
    // line['stroke - width'] = 2;
    // edge.attr('line', line);
  });
}

export function showPorts(ports, show = false) {
  for (const port of ports) {
    if (port.style) {
      port.style.visibility = show ? 'visible' : 'hidden';
    }
  }
}

