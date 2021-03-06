import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

const AnimatedComponentView = ({animEvent, viewObject, speed, bouncy, startDisplay, targetDisplay, runAnimation, onRest}) => {

  if (!runAnimation) return null;
  if (!startDisplay || !targetDisplay) return null;

  let springiness = 100, damping = 25;
  if (bouncy) damping = 2;
  let linear = false;
  if (speed != null){
    if (speed === "slow"){
      springiness = 60;
    } else if (speed === "medium"){
      springiness = 90;
    }
    else if (speed === "fast"){
      springiness = 120;
    }
    else if (speed === "superfast"){
      springiness = 150;
    }
  } else {
    linear = true;
  }

  const springConfig = { stiffness: springiness, damping: damping };
  //const springConfig = {...presets.noWobble, precision: 0.1};

  let startStyle = {}, endStyle = {};
  if (startDisplay.startPositionRect) {
    startStyle.left = startDisplay.startPositionRect.left;
    startStyle.top = startDisplay.startPositionRect.top;
  }
  if (startDisplay.opacity != null){
    startStyle.opacity = startDisplay.opacity;
  }
  if (startDisplay.size != null){
    startStyle.size = startDisplay.size;
  }

  if (targetDisplay.targetPositionRect) {
    if (!linear){
      endStyle.left = spring(targetDisplay.targetPositionRect.left, springConfig);
      endStyle.top = spring(targetDisplay.targetPositionRect.top, springConfig);
    } else {
      endStyle.left = targetDisplay.targetPositionRect.left;
      endStyle.top = targetDisplay.targetPositionRect.top;
    }
  }
  if (targetDisplay.opacity != null) {
    endStyle.opacity = spring(targetDisplay.opacity, springConfig);
  }
  if (targetDisplay.size != null){
    endStyle.size = spring(targetDisplay.size, springConfig);
  }

  const animatedViewObject = function(interpolatedStyle) {
    return React.cloneElement(viewObject, {
        displayStyle: interpolatedStyle
      });
  };

  const onAnimationFinished = () => {
    onRest(animEvent);
  };

  return (
    <Motion className='geniblocks animated-component-view'
          defaultStyle={startStyle}
          style={endStyle}
          onRest={onAnimationFinished} >
      {
        interpolatedStyle => {
          return (
            <div className="animated-component-container" style={interpolatedStyle}>
             { animatedViewObject(interpolatedStyle) }
            </div>
          );
        }
      }
    </Motion>
  );
};

AnimatedComponentView.propTypes = {
  animEvent: PropTypes.number,
  viewObject: PropTypes.object,
  speed: PropTypes.string,
  bouncy: PropTypes.bool,
  onRest: PropTypes.func,
  startDisplay: PropTypes.shape({   // initial display properties
    startPositionRect: PropTypes.object,
    size: PropTypes.number,         // size of rendered component (percentage string)
    rotation: PropTypes.number,     // rotation (deg) of component (default: 0|90|180|270)
    opacity: PropTypes.number       // opacity of component (default: 1.0)
  }).isRequired,
  targetDisplay: PropTypes.shape({  // final display properties
    targetPositionRect: PropTypes.object,
    size: PropTypes.number,
    rotation: PropTypes.number,
    opacity: PropTypes.number
  }).isRequired,
  runAnimation: PropTypes.bool
};

export default AnimatedComponentView;
