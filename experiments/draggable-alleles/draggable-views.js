"use strict";

var DragSource = ReactDnD.DragSource,
    DropTarget = ReactDnD.DropTarget,
    shapeColorMap = {
  W: { shape: "circle", color: "blue" },
  w: { shape: "circle", color: "lightskyblue" },
  T: { shape: "square", color: "forestgreen" },
  Tk: { shape: "square", color: "limegreen" },
  t: { shape: "square", color: "mediumspringgreen" }
},
    ItemTypes = {
  ALLELE: 'allele'
},
    alleleSource = {
  beginDrag: function beginDrag(props) {
    return { index: props.index, org: props.org, shape: shapeColorMap[props.allele].shape };
  }
},
    collectSource = function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
},
    WrappedAllele = React.createClass({
  displayName: "WrappedAllele",

  render: function render() {
    var connectDragSource = this.props.connectDragSource,
        isDragging = this.props.isDragging,
        allele = this.props.allele;
    return connectDragSource(React.createElement('div', {}, !isDragging ? React.createElement(GeniBlocks.AlleleView, { allele: allele, color: shapeColorMap[allele].color, shape: shapeColorMap[allele].shape }) : null));
  }
}),
    DraggableAllele = DragSource(ItemTypes.ALLELE, alleleSource, collectSource)(WrappedAllele),
    alleleTarget = {
  drop: function drop(props, monitor) {
    props.moveAllele(monitor.getItem().index, monitor.getItem().org, props.index, props.org);
  },
  canDrop: function canDrop(props, monitor) {
    //console.log("can drop??");
    //console.log(monitor.getItem());
    //console.log(props);
    return monitor.getItem().shape === props.shape;
  }
},
    collectTarget = function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
},
    WrappedAlleleTarget = React.createClass({
  displayName: "WrappedAlleleTarget",

  render: function render() {
    var connectDropTarget = this.props.connectDropTarget,
        isOver = this.props.isOver,
        canDrop = this.props.canDrop,
        shape = this.props.shape,
        allele = this.props.allele;
    return connectDropTarget(React.createElement('div', {}, React.createElement(GeniBlocks.AlleleView, { allele: allele, color: allele ? shapeColorMap[allele].color : null, shape: allele ? shapeColorMap[allele].shape : shape, target: true, hovering: isOver && canDrop })));
  }
}),
    AlleleDropTarget = DropTarget(ItemTypes.ALLELE, alleleTarget, collectTarget)(WrappedAlleleTarget),
    AlleleContainer = React.createClass({
  displayName: "AlleleContainer",

  render: function render() {
    var allelePool = this.props.pool,
        alleleTargets = this.props.targets,
        org = this.props.org,
        moveAllele = this.props.moveAllele;

    var pool = allelePool.map(function (allele, i) {
      if (!allele) return null;
      return React.createElement(DraggableAllele, { allele: allele, key: i, index: i, org: org });
    });

    var targets = alleleTargets.map(function (allele, i) {
      if (allele === "circle" || allele === "square") {
        var shape = allele;
        allele = null;
      } else {
        shape = shapeColorMap[allele].shape;
      }
      return React.createElement(AlleleDropTarget, { allele: allele, key: i, shape: shape, index: i, org: org, moveAllele: moveAllele });
    });

    return React.createElement('div', { className: "allele-container" }, React.createElement('div', { className: "allele-targets labelable" }, targets), React.createElement('div', { className: "allele-pool" }, pool));
  }
}),
    PunnettContainer = React.createClass({
  displayName: "PunnettContainer",

  render: function render() {
    var alleles = this.props.alleles,
        orgs = this.props.orgs,
        moveAllele = this.props.moveAllele,
        orgViews = orgs.map(function (org, index) {
      return org ? React.createElement(GeniBlocks.OrganismView, { org: org, key: index }) : null;
    });

    return React.createElement('div', { className: "punnett-square" }, React.createElement('div', { className: "top" }, React.createElement(AlleleDropTarget, { allele: alleles[0], shape: "circle", index: 0, moveAllele: moveAllele }), React.createElement(AlleleDropTarget, { allele: alleles[1], shape: "circle", index: 1, moveAllele: moveAllele })), React.createElement('div', { className: "row" }, React.createElement(AlleleDropTarget, { allele: alleles[2], shape: "circle", index: 2, moveAllele: moveAllele }), React.createElement('div', { className: "box org-1" }, orgViews[0]), React.createElement('div', { className: "box org-2" }, orgViews[2])), React.createElement('div', { className: "row" }, React.createElement(AlleleDropTarget, { allele: alleles[3], shape: "circle", index: 3, moveAllele: moveAllele }), React.createElement('div', { className: "box org-3" }, orgViews[1]), React.createElement('div', { className: "box org-4" }, orgViews[3])));
  }
});

window.AlleleContainer = AlleleContainer;
window.PunnettContainer = PunnettContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4cGVyaW1lbnRzL2RyYWdnYWJsZS1hbGxlbGVzL2RyYWdnYWJsZS12aWV3cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksYUFBYSxTQUFTLFVBQVQ7SUFDYixhQUFhLFNBQVMsVUFBVDtJQUViLGdCQUFnQjtBQUNkLEtBQUksRUFBQyxPQUFPLFFBQVAsRUFBaUIsT0FBTyxNQUFQLEVBQXRCO0FBQ0EsS0FBSSxFQUFDLE9BQU8sUUFBUCxFQUFpQixPQUFPLGNBQVAsRUFBdEI7QUFDQSxLQUFJLEVBQUMsT0FBTyxRQUFQLEVBQWlCLE9BQU8sYUFBUCxFQUF0QjtBQUNBLE1BQUksRUFBQyxPQUFPLFFBQVAsRUFBaUIsT0FBTyxXQUFQLEVBQXRCO0FBQ0EsS0FBSSxFQUFDLE9BQU8sUUFBUCxFQUFpQixPQUFPLG1CQUFQLEVBQXRCO0NBTEY7SUFRQSxZQUFZO0FBQ1YsVUFBUSxRQUFSO0NBREY7SUFJQSxlQUFlO0FBQ2IsYUFBVyxtQkFBVSxLQUFWLEVBQWlCO0FBQzFCLFdBQU8sRUFBQyxPQUFPLE1BQU0sS0FBTixFQUFhLEtBQUssTUFBTSxHQUFOLEVBQVcsT0FBTyxjQUFjLE1BQU0sTUFBTixDQUFkLENBQTRCLEtBQTVCLEVBQW5ELENBRDBCO0dBQWpCO0NBRGI7SUFNQSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBUyxPQUFULEVBQWtCLE9BQWxCLEVBQTJCO0FBQ3pDLFNBQU87QUFDTCx1QkFBbUIsUUFBUSxVQUFSLEVBQW5CO0FBQ0EsZ0JBQVksUUFBUSxVQUFSLEVBQVo7R0FGRixDQUR5QztDQUEzQjtJQU9oQixnQkFBZ0IsTUFBTSxXQUFOLENBQWtCOzs7QUFDaEMsVUFBUSxrQkFBWTtBQUNsQixRQUFJLG9CQUFvQixLQUFLLEtBQUwsQ0FBVyxpQkFBWDtRQUNwQixhQUFhLEtBQUssS0FBTCxDQUFXLFVBQVg7UUFDYixTQUFTLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FISztBQUlsQixXQUFPLGtCQUNMLE1BQU0sYUFBTixDQUFv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V0FBWCxFQUE1QixFQUFxRCxTQUFTLENBQVQsQ0FBckQsQ0FIRixDQVZGLENBREYsQ0FUa0I7R0FBWjtDQURTLENBQW5COztBQStCSixPQUFPLGVBQVAsR0FBeUIsZUFBekI7QUFDQSxPQUFPLGdCQUFQLEdBQTBCLGdCQUExQiIsImZpbGUiOiJleHBlcmltZW50cy9kcmFnZ2FibGUtYWxsZWxlcy9kcmFnZ2FibGUtdmlld3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRHJhZ1NvdXJjZSA9IFJlYWN0RG5ELkRyYWdTb3VyY2UsXG4gICAgRHJvcFRhcmdldCA9IFJlYWN0RG5ELkRyb3BUYXJnZXQsXG5cbiAgICBzaGFwZUNvbG9yTWFwID0ge1xuICAgICAgVzogIHtzaGFwZTogXCJjaXJjbGVcIiwgY29sb3I6IFwiYmx1ZVwifSxcbiAgICAgIHc6ICB7c2hhcGU6IFwiY2lyY2xlXCIsIGNvbG9yOiBcImxpZ2h0c2t5Ymx1ZVwifSxcbiAgICAgIFQ6ICB7c2hhcGU6IFwic3F1YXJlXCIsIGNvbG9yOiBcImZvcmVzdGdyZWVuXCJ9LFxuICAgICAgVGs6IHtzaGFwZTogXCJzcXVhcmVcIiwgY29sb3I6IFwibGltZWdyZWVuXCJ9LFxuICAgICAgdDogIHtzaGFwZTogXCJzcXVhcmVcIiwgY29sb3I6IFwibWVkaXVtc3ByaW5nZ3JlZW5cIn1cbiAgICB9LFxuXG4gICAgSXRlbVR5cGVzID0ge1xuICAgICAgQUxMRUxFOiAnYWxsZWxlJ1xuICAgIH0sXG5cbiAgICBhbGxlbGVTb3VyY2UgPSB7XG4gICAgICBiZWdpbkRyYWc6IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICByZXR1cm4ge2luZGV4OiBwcm9wcy5pbmRleCwgb3JnOiBwcm9wcy5vcmcsIHNoYXBlOiBzaGFwZUNvbG9yTWFwW3Byb3BzLmFsbGVsZV0uc2hhcGV9O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb2xsZWN0U291cmNlID0gZnVuY3Rpb24oY29ubmVjdCwgbW9uaXRvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29ubmVjdERyYWdTb3VyY2U6IGNvbm5lY3QuZHJhZ1NvdXJjZSgpLFxuICAgICAgICBpc0RyYWdnaW5nOiBtb25pdG9yLmlzRHJhZ2dpbmcoKVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgV3JhcHBlZEFsbGVsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29ubmVjdERyYWdTb3VyY2UgPSB0aGlzLnByb3BzLmNvbm5lY3REcmFnU291cmNlLFxuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IHRoaXMucHJvcHMuaXNEcmFnZ2luZyxcbiAgICAgICAgICAgIGFsbGVsZSA9IHRoaXMucHJvcHMuYWxsZWxlO1xuICAgICAgICByZXR1cm4gY29ubmVjdERyYWdTb3VyY2UoXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge30sXG4gICAgICAgICAgICAhaXNEcmFnZ2luZyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5BbGxlbGVWaWV3LCB7YWxsZWxlOiBhbGxlbGUsIGNvbG9yOiBzaGFwZUNvbG9yTWFwW2FsbGVsZV0uY29sb3IsIHNoYXBlOiBzaGFwZUNvbG9yTWFwW2FsbGVsZV0uc2hhcGV9KSA6IG51bGxcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSksXG5cbiAgICBEcmFnZ2FibGVBbGxlbGUgPSBEcmFnU291cmNlKEl0ZW1UeXBlcy5BTExFTEUsIGFsbGVsZVNvdXJjZSwgY29sbGVjdFNvdXJjZSkoV3JhcHBlZEFsbGVsZSksXG5cbiAgICBhbGxlbGVUYXJnZXQgPSB7XG4gICAgICBkcm9wOiBmdW5jdGlvbiAocHJvcHMsIG1vbml0b3IpIHtcbiAgICAgICAgcHJvcHMubW92ZUFsbGVsZShtb25pdG9yLmdldEl0ZW0oKS5pbmRleCwgbW9uaXRvci5nZXRJdGVtKCkub3JnLCBwcm9wcy5pbmRleCwgcHJvcHMub3JnKTtcbiAgICAgIH0sXG4gICAgICBjYW5Ecm9wOiBmdW5jdGlvbiAocHJvcHMsIG1vbml0b3IpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcImNhbiBkcm9wPz9cIik7XG4gICAgICAgIC8vY29uc29sZS5sb2cobW9uaXRvci5nZXRJdGVtKCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHByb3BzKTtcbiAgICAgICAgcmV0dXJuIChtb25pdG9yLmdldEl0ZW0oKS5zaGFwZSA9PT0gcHJvcHMuc2hhcGUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb2xsZWN0VGFyZ2V0ID0gZnVuY3Rpb24oY29ubmVjdCwgbW9uaXRvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29ubmVjdERyb3BUYXJnZXQ6IGNvbm5lY3QuZHJvcFRhcmdldCgpLFxuICAgICAgICBpc092ZXI6IG1vbml0b3IuaXNPdmVyKCksXG4gICAgICAgIGNhbkRyb3A6IG1vbml0b3IuY2FuRHJvcCgpXG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBXcmFwcGVkQWxsZWxlVGFyZ2V0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb25uZWN0RHJvcFRhcmdldCA9IHRoaXMucHJvcHMuY29ubmVjdERyb3BUYXJnZXQsXG4gICAgICAgICAgICBpc092ZXIgPSB0aGlzLnByb3BzLmlzT3ZlcixcbiAgICAgICAgICAgIGNhbkRyb3AgPSB0aGlzLnByb3BzLmNhbkRyb3AsXG4gICAgICAgICAgICBzaGFwZSA9IHRoaXMucHJvcHMuc2hhcGUsXG4gICAgICAgICAgICBhbGxlbGUgPSB0aGlzLnByb3BzLmFsbGVsZTtcbiAgICAgICAgcmV0dXJuIGNvbm5lY3REcm9wVGFyZ2V0KFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHt9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLkFsbGVsZVZpZXcsIHthbGxlbGU6IGFsbGVsZSwgY29sb3I6IChhbGxlbGUgPyBzaGFwZUNvbG9yTWFwW2FsbGVsZV0uY29sb3IgOiBudWxsKSwgc2hhcGU6IChhbGxlbGUgPyBzaGFwZUNvbG9yTWFwW2FsbGVsZV0uc2hhcGUgOiBzaGFwZSksIHRhcmdldDogdHJ1ZSwgaG92ZXJpbmc6IChpc092ZXIgJiYgY2FuRHJvcCl9KVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KSxcblxuICAgIEFsbGVsZURyb3BUYXJnZXQgPSBEcm9wVGFyZ2V0KEl0ZW1UeXBlcy5BTExFTEUsIGFsbGVsZVRhcmdldCwgY29sbGVjdFRhcmdldCkoV3JhcHBlZEFsbGVsZVRhcmdldCksXG5cbiAgICBBbGxlbGVDb250YWluZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFsbGVsZVBvb2wgPSB0aGlzLnByb3BzLnBvb2wsXG4gICAgICAgICAgICBhbGxlbGVUYXJnZXRzID0gdGhpcy5wcm9wcy50YXJnZXRzLFxuICAgICAgICAgICAgb3JnID0gdGhpcy5wcm9wcy5vcmcsXG4gICAgICAgICAgICBtb3ZlQWxsZWxlID0gdGhpcy5wcm9wcy5tb3ZlQWxsZWxlO1xuXG4gICAgICAgIHZhciBwb29sID0gYWxsZWxlUG9vbC5tYXAoZnVuY3Rpb24oYWxsZWxlLCBpKSB7XG4gICAgICAgICAgaWYgKCFhbGxlbGUpIHJldHVybiBudWxsO1xuICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KERyYWdnYWJsZUFsbGVsZSwge2FsbGVsZTogYWxsZWxlLCBrZXk6IGksIGluZGV4OiBpLCBvcmc6IG9yZ30pO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGFyZ2V0cyA9IGFsbGVsZVRhcmdldHMubWFwKGZ1bmN0aW9uKGFsbGVsZSwgaSkge1xuICAgICAgICAgIGlmIChhbGxlbGUgPT09IFwiY2lyY2xlXCIgfHwgYWxsZWxlID09PSBcInNxdWFyZVwiKSB7XG4gICAgICAgICAgICB2YXIgc2hhcGUgPSBhbGxlbGU7XG4gICAgICAgICAgICBhbGxlbGUgPSBudWxsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaGFwZSA9IHNoYXBlQ29sb3JNYXBbYWxsZWxlXS5zaGFwZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWxsZWxlRHJvcFRhcmdldCwge2FsbGVsZTogYWxsZWxlLCBrZXk6IGksIHNoYXBlOiBzaGFwZSwgaW5kZXg6IGksIG9yZzogb3JnLCBtb3ZlQWxsZWxlOiBtb3ZlQWxsZWxlfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge2NsYXNzTmFtZTogXCJhbGxlbGUtY29udGFpbmVyXCJ9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge2NsYXNzTmFtZTogXCJhbGxlbGUtdGFyZ2V0cyBsYWJlbGFibGVcIn0sXG4gICAgICAgICAgICAgIHRhcmdldHNcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImFsbGVsZS1wb29sXCJ9LFxuICAgICAgICAgICAgICBwb29sXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pLFxuXG4gICAgUHVubmV0dENvbnRhaW5lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWxsZWxlcyA9IHRoaXMucHJvcHMuYWxsZWxlcyxcbiAgICAgICAgICAgIG9yZ3MgPSB0aGlzLnByb3BzLm9yZ3MsXG4gICAgICAgICAgICBtb3ZlQWxsZWxlID0gdGhpcy5wcm9wcy5tb3ZlQWxsZWxlLFxuXG4gICAgICAgICAgICBvcmdWaWV3cyA9IG9yZ3MubWFwKGZ1bmN0aW9uKG9yZywgaW5kZXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9yZyA/ICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuT3JnYW5pc21WaWV3LCB7b3JnOiBvcmcsIGtleTogaW5kZXh9KSA6IG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtjbGFzc05hbWU6IFwicHVubmV0dC1zcXVhcmVcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcInRvcFwifSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBbGxlbGVEcm9wVGFyZ2V0LCB7YWxsZWxlOiBhbGxlbGVzWzBdLCBzaGFwZTogXCJjaXJjbGVcIiwgaW5kZXg6IDAsIG1vdmVBbGxlbGU6IG1vdmVBbGxlbGV9KSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBbGxlbGVEcm9wVGFyZ2V0LCB7YWxsZWxlOiBhbGxlbGVzWzFdLCBzaGFwZTogXCJjaXJjbGVcIiwgaW5kZXg6IDEsIG1vdmVBbGxlbGU6IG1vdmVBbGxlbGV9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtjbGFzc05hbWU6IFwicm93XCJ9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEFsbGVsZURyb3BUYXJnZXQsIHthbGxlbGU6IGFsbGVsZXNbMl0sIHNoYXBlOiBcImNpcmNsZVwiLCBpbmRleDogMiwgbW92ZUFsbGVsZTogbW92ZUFsbGVsZX0pLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImJveCBvcmctMVwifSwgb3JnVmlld3NbMF0pLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImJveCBvcmctMlwifSwgb3JnVmlld3NbMl0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge2NsYXNzTmFtZTogXCJyb3dcIn0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWxsZWxlRHJvcFRhcmdldCwge2FsbGVsZTogYWxsZWxlc1szXSwgc2hhcGU6IFwiY2lyY2xlXCIsIGluZGV4OiAzLCBtb3ZlQWxsZWxlOiBtb3ZlQWxsZWxlfSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtjbGFzc05hbWU6IFwiYm94IG9yZy0zXCJ9LCBvcmdWaWV3c1sxXSksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtjbGFzc05hbWU6IFwiYm94IG9yZy00XCJ9LCBvcmdWaWV3c1szXSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbndpbmRvdy5BbGxlbGVDb250YWluZXIgPSBBbGxlbGVDb250YWluZXI7XG53aW5kb3cuUHVubmV0dENvbnRhaW5lciA9IFB1bm5ldHRDb250YWluZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=