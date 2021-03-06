import React, { Component, PropTypes } from 'react';
import OrganismView from '../components/organism';
import GenomeView from '../components/genome';
import ButtonView from '../components/button';
import PenView from '../components/pen';
import GameteImageView from '../components/gamete-image';
import AnimatedComponentView from '../components/animated-component';
import ChromosomeImageView from '../components/chromosome-image';

// a "reasonable" lookup function for the two gametes
function lookupGameteChromosomeDOMElement(org, chromosomeName) {
  let wrapperId = org.sex === 0 ? "father-gamete-genome" : "mother-gamete-genome",
      wrapper = document.getElementById(wrapperId),
      chromosomePositions = {"1": 0, "2": 1, "XY": 2};
  let genomeWrapper = wrapper.getElementsByClassName("genome")[0];
  return genomeWrapper.querySelectorAll(".chromosome-image")[chromosomePositions[chromosomeName]];
}

function findBothElements(org, name, el){
  let t = lookupGameteChromosomeDOMElement(org, name);
  let s = el.getElementsByClassName("chromosome-allele-container")[0]; // the image of the alleles inside the chromosome container
  let positions = {
    startPositionRect : s.getClientRects()[0],
    targetPositionRect: t.getClientRects()[0]
  };
  return positions;
}

var _this,
  animatedComponents = [],
  animatedComponentToRender,
  startDisplay, targetDisplay,
  lastAnimatedComponentId = 0,
  ovumView, spermView,
  animationTimeline = {},
  mother, father,
  ovumTarget, spermTarget,
  animatedOvumView, animatedSpermView,

  motherDrakeStart, motherGameteStart,
  fatherDrakeStart, fatherGameteStart,

  gameteDisplayStyle = { display: "none" },
  chromosomeDisplayStyle = {display: "none"},

  hatchSoundPlayed = false,
  offsetTopDrake = 130, offsetTopGamete = 160;

var animationEvents = {
  showGametes: { id: 0, count: 0, complete: false, animate: function() {
      let motherPositions = {
          startPositionRect : motherDrakeStart,
          targetPositionRect: motherGameteStart,
          startSize: 0.3,
          endSize: 0.3
        };

      let fatherPositions = {
        startPositionRect : fatherDrakeStart,
        targetPositionRect: fatherGameteStart,
        startSize: 0.3,
        endSize: 0.3
      };

      let displayStyleContainer = {animated: true, size: 0.3};
      animatedOvumView  = <GameteImageView isEgg={true} displayStyle={displayStyleContainer} />;
      animatedSpermView = <GameteImageView isEgg={false} displayStyle={displayStyleContainer} />;

      let opacity = {
        start: 1.0,
        end: 1.0
      };

      animateMultipleComponents([animatedOvumView, animatedSpermView],  [motherPositions, fatherPositions], opacity, animationEvents.showGametes.id);
      _this.setState({animation:"showGametes"});
    }
  },
  moveGametes: { id: 1, count: 0, complete: false, animate: function(){
      let motherPositions = {
          startPositionRect : motherGameteStart,
          targetPositionRect: ovumTarget,
          startSize: 0.3,
          endSize: 1.0
      };

      let fatherPositions = {
        startPositionRect : fatherGameteStart,
        targetPositionRect: spermTarget,
        startSize: 0.3,
        endSize: 1.0
      };

      let opacity = {
        start: 1.0,
        end: 1.0
      };

      animateMultipleComponents([animatedOvumView, animatedSpermView], [motherPositions, fatherPositions], opacity, animationEvents.moveGametes.id);
      _this.setState({animation:"moveGametes"});
    }
  },
  selectChromosome: { id: 2, complete: false, ready: false, animate: function(positions, targetIsY){
      let opacity = {
        start: 1.0,
        end: 0.0
      };
      animatedComponentToRender = <ChromosomeImageView small={true} empty={false} bold={false} yChromosome={targetIsY}/>;
      animateMultipleComponents([animatedComponentToRender], [positions], opacity, animationEvents.selectChromosome.id);
      _this.setState({animation:"selectChromosome"});
    }
  },
  fertilize: { id: 3, inProgress: false, complete: false, animate: function(){
      animationEvents.selectChromosome.ready = false;
      animationEvents.fertilize.started = true;

      setTimeout( () => {
        animationFinish(animationEvents.fertilize.id);
      }, 3000);
    }
  },
  hatch: { id: 4, inProgress: false, complete: false, animate: function(){
      animationEvents.hatch.inProgress = true;
      animationEvents.hatch.complete = false;
      hatchSoundPlayed = false;
      _this.setState({hatchStarted:"true"});
      setTimeout( () => {
        animationFinish(animationEvents.hatch.id);
      }, 3000);
    }
  }

};
function resetAnimationEvents(){
  animationEvents.selectChromosome.ready = true;
  animationEvents.fertilize.started = false;
  animationEvents.fertilize.complete = false;
  animationEvents.hatch.inProgress = false;
  animationEvents.hatch.complete = false;
  gameteDisplayStyle = {};
}

function runAnimation(animationEvent, positions, opacity, speed = "fast"){
  startDisplay = {
    startPositionRect: positions.startPositionRect,
    opacity: opacity.start,
    size: positions.startSize
  };
  targetDisplay = {
    targetPositionRect: positions.targetPositionRect,
    opacity: opacity.end,
    size: positions.endSize
  };

  let animationSpeed = speed;
  animationTimeline[lastAnimatedComponentId] = animationEvent;
  animatedComponents.push(
    <AnimatedComponentView key={lastAnimatedComponentId}
      animEvent={animationEvent}
      speed={animationSpeed}
      viewObject={animatedComponentToRender}
      startDisplay={startDisplay}
      targetDisplay={targetDisplay}
      runAnimation={true}
      onRest={animationFinish} />);
  lastAnimatedComponentId++;
}

function animationFinish(evt){
  switch(evt){
    case animationEvents.showGametes.id:
      animationEvents.showGametes.count++;
      if (animationEvents.showGametes.count === 2){
        animationEvents.showGametes.complete = true;
        animatedComponents = [];
        animationEvents.moveGametes.animate();
      }
      break;
    case animationEvents.moveGametes.id:
      animationEvents.moveGametes.count++;
      if (animationEvents.moveGametes.count === 2){
        animatedComponents = [];
        // show gametes
        gameteDisplayStyle = {};
        animationEvents.moveGametes.complete = true;
        animationEvents.selectChromosome.ready = true;
        // show gamete placeholders
        chromosomeDisplayStyle = {};
      }
      break;
    case animationEvents.fertilize.id:
      animationEvents.fertilize.complete = true;
      gameteDisplayStyle = {display: "none"};
      animationEvents.hatch.animate();
      break;
    case animationEvents.hatch.id:
      animationEvents.hatch.complete = true;
      break;
    default:
      break;
  }
  _this.setState({animation:"complete"});
}

function animateMultipleComponents(componentsToAnimate, positions, opacity, animationEvent){
  for (let i = 0; i < componentsToAnimate.length; i++){
    animatedComponentToRender = componentsToAnimate[i];
    runAnimation(animationEvent, positions[i], opacity);
  }
}

export default class EggGame extends Component {

    render() {
       const { drakes, gametes, onChromosomeAlleleChange, onGameteChromosomeAdded, onFertilize, onHatch, onResetGametes, onKeepOffspring, hiddenAlleles } = this.props,
          mother = new BioLogica.Organism(BioLogica.Species.Drake, drakes[0].alleleString, drakes[0].sex),
          father = new BioLogica.Organism(BioLogica.Species.Drake, drakes[1].alleleString, drakes[1].sex);

      let child = null;
      if (drakes[2]) {
        child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex);
      }

      const handleAlleleChange = function(chrom, side, prevAllele, newAllele) {
        onChromosomeAlleleChange(0, chrom, side, prevAllele, newAllele);
      };
      const handleChromosomeSelected = function(org, name, side, el) {
        if (animationEvents.selectChromosome.ready){
          let positions = findBothElements(org, name, el);
          let targetIsY = el.getElementsByClassName("chromosome-allele-container")[0].id.endsWith('XYy');
          // animate the chromosomes being added
          animationEvents.selectChromosome.animate(positions, targetIsY);

          setTimeout(function() {
            onGameteChromosomeAdded(org.sex, name, side);
          }, 500);
        }
      };
      const handleFertilize = function() {
        if (Object.keys(gametes[0]).length === 3 && Object.keys(gametes[1]).length === 3) {
          animationEvents.selectChromosome.ready = false;
          animatedComponents = [];
          animationEvents.fertilize.animate();
          onFertilize(0,1);
        }
      };

      const handleHatch = function () {
        if (!hatchSoundPlayed) {
          onHatch();
          hatchSoundPlayed = true;
        }
      };

      const handleKeepOffspring = function () {
        let childImage = child.getImageName(),
            [,,,...keptDrakes] = drakes,
            success = true;
        for (let drake of keptDrakes) {
          let org = new BioLogica.Organism(BioLogica.Species.Drake, drake.alleleString, drake.sex);
          if (org.getImageName() === childImage) {
            success = false;
            break;
          }
        }
        resetAnimationEvents();
        onKeepOffspring(2, success, 8);
      };
      const handleReset = function() {
        resetAnimationEvents();
        onResetGametes();
      };

      function getGameteChromosome(index, chromosomeName) {
        var parent = index === 1 ? mother : father;
        if (gametes[index][chromosomeName]) {
          return parent.getGenotype().chromosomes[chromosomeName][gametes[index][chromosomeName]];
        }
      }

      const femaleGameteChromosomeMap = {
        "1":  { a: getGameteChromosome(1, 1)},
        "2":  { a: getGameteChromosome(1, 2)},
        "XY": { a: getGameteChromosome(1, "XY") }
      };

      const maleGameteChromosomeMap = {
        "1":  { b: getGameteChromosome(0, 1)},
        "2":  { b: getGameteChromosome(0, 2)},
        "XY": { b: getGameteChromosome(0, "XY") }
      };

      let gametesClass = "gametes";
      if (!drakes[2]) {
        gametesClass += " unfertilized";
      }

      var childView;
      if (drakes[2] && animationEvents.hatch.complete) {
        handleHatch();
        let child = new BioLogica.Organism(BioLogica.Species.Drake, drakes[2].alleleString, drakes[2].sex);
        childView = (
          [
            <OrganismView org={ child } width={170} key={0}/>,
            <div className="offspring-buttons" key={1}>
              <ButtonView label={ "Save this" } onClick={ handleKeepOffspring } key={2} />
              <ButtonView label={ "Try again" } onClick={ handleReset } key={3} />
            </div>
          ]
        );
      } else {
        if (animationEvents.hatch.inProgress) {
          childView = <img className="egg-image" src="resources/images/egg_yellow.png" />;
        } else {
          let text = "Fertilize ❤️",
              className = "fertilize-button";
          if (Object.keys(gametes[0]).length !== 3 || Object.keys(gametes[1]).length !== 3) {
            text = "Fertilize",
            className += " disabled";
          }
          childView = <ButtonView className={ className } label={ text } onClick={ handleFertilize } />;
        }
      }
      let oChroms = femaleGameteChromosomeMap,
          sChroms = maleGameteChromosomeMap,
          ovumChromosomes  = [oChroms[1] && oChroms[1].a, oChroms[2] && oChroms[2].a, oChroms.XY && oChroms.XY.a],
          spermChromosomes = [sChroms[1] && sChroms[1].b, sChroms[2] && sChroms[2].b, sChroms.XY && sChroms.XY.b];

      ovumView  = <GameteImageView className="ovum"  isEgg={true}  chromosomes={ovumChromosomes} displayStyle={gameteDisplayStyle} />;
      spermView = <GameteImageView className="sperm" isEgg={false} chromosomes={spermChromosomes} displayStyle={gameteDisplayStyle} />;

      let [,,,...keptDrakes] = drakes;
      keptDrakes = keptDrakes.asMutable().map((org) => new BioLogica.Organism(BioLogica.Species.Drake, org.alleleString, org.sex));

      return (
      <div id="egg-game">
        <div className="columns">
          <div className='column'>
            <div className="mother">Mother</div>
              <OrganismView org={ mother } flipped={ true } />
              <GenomeView orgName="mother" org={ mother } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } small={ true } selectedChromosomes={ gametes[1] } />
          </div>
          <div className='egg column'>
            <div className='top'>
              { childView }
            </div>
            <div className={ gametesClass }>
              <div className='half-genome half-genome-left' id="mother-gamete-genome">
                { ovumView }
                <GenomeView orgName="targetmother" chromosomes={ femaleGameteChromosomeMap } species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } small={ true } displayStyle={chromosomeDisplayStyle} />
              </div>
              <div className='half-genome half-genome-right' id="father-gamete-genome">
                { spermView }
                <GenomeView orgName="targetfather" chromosomes={ maleGameteChromosomeMap }   species={ mother.species } editable={false} hiddenAlleles= { hiddenAlleles } small={ true } displayStyle={chromosomeDisplayStyle} />
              </div>
            </div>
          </div>
          <div className='column'>
            <div className="father">Father</div>
              <OrganismView org={ father } className="father" />
              <GenomeView orgName="father" org={ father } onAlleleChange={ handleAlleleChange } onChromosomeSelected={handleChromosomeSelected} editable={false} hiddenAlleles= { hiddenAlleles } small={ true } selectedChromosomes={ gametes[0] } />
          </div>
        </div>
        <div className='columns bottom'>
          <PenView orgs={ keptDrakes } width={500} columns={5} rows={1} tightenRows={20}/>
        </div>
        {animatedComponents}
      </div>
    );
  }

  componentDidMount() {
    // now that the DOM is loaded, get the positions of the elements
    _this = this;

    mother = document.getElementsByClassName("mother")[0].getClientRects()[0];
    father = document.getElementsByClassName("father")[0].getClientRects()[0];

    ovumTarget = document.getElementsByClassName("ovum")[0].getClientRects()[0];
    spermTarget = document.getElementsByClassName("sperm")[0].getClientRects()[0];

    motherDrakeStart = {
      top: mother.top + offsetTopDrake,
      left: mother.left
    };
    motherGameteStart = {
      top: mother.top + offsetTopGamete,
      left: mother.left
    };
    fatherDrakeStart = {
      top: father.top + offsetTopDrake,
      left: father.left
    };
    fatherGameteStart = {
      top: father.top + offsetTopGamete,
      left: father.left
    };

    // animate the gametes moving from parents after page has rendered
    setTimeout( () => {
      // first animation - show gametes
      animationEvents.showGametes.animate();
    }, 1000);
  }

  static propTypes = {
    drakes: PropTypes.array.isRequired,
    gametes: PropTypes.array.isRequired,
    hiddenAlleles: PropTypes.array.isRequired,
    onChromosomeAlleleChange: PropTypes.func.isRequired,
    onGameteChromosomeAdded: PropTypes.func.isRequired,
    onFertilize: PropTypes.func.isRequired,
    onHatch: PropTypes.func,
    onAnimationStart: PropTypes.func,
    onAnimationEnd: PropTypes.func,
    challenge: PropTypes.number.isRequired
  }
  static authoredDrakesToDrakeArray = function(authoredChallenge) {
    return [authoredChallenge.mother, authoredChallenge.father];
  }
  static initialGametesArray = function() {
    return [{}, {}];
  }
}
