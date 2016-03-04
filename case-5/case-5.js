"use strict";

var father = new BioLogica.Organism(BioLogica.Species.Drake, "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog", 0);
var mother = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1),
    offspring = [],
    clutch = [],
    clutchSize = 20,
    testSelection = {},
    showingTest = false;

function render() {
  // Mother org
  ReactDOM.render(React.createElement(GeniBlocks.OrganismView, { org: mother }), document.getElementById('mother'));
  // Father org
  ReactDOM.render(React.createElement(GeniBlocks.OrganismView, { org: father }), document.getElementById('father'));

  // Mother genome
  ReactDOM.render(React.createElement(GeniBlocks.GenomeView, {
    org: mother,
    hiddenAlleles: ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    alleleChanged: function alleleChanged(chrom, side, prevAllele, newAllele) {
      mother.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
      mother = new BioLogica.Organism(BioLogica.Species.Drake, mother.getAlleleString(), 1);
      clutch = [];
      offspring = [];
      render();
    }
  }), document.getElementById('mother-genome'));

  // Breeding pen
  /* global ReactSimpleTabs */
  var rce = React.createElement,
      Tabs = ReactSimpleTabs;
  ReactDOM.render(rce(Tabs, null, [rce(Tabs.Panel, { title: "Breeding Pen", key: "Breeding Pen" }, rce(GeniBlocks.PenView, { orgs: clutch })), rce(Tabs.Panel, { title: "Stats", key: "Stats" }, rce(GeniBlocks.StatsView, { orgs: offspring, lastClutchSize: clutchSize }))]), document.getElementById('breeding-pen'));

  // Father genome test (in overlay)
  ReactDOM.render(React.createElement(GeniBlocks.GenomeTestView, {
    org: father,
    hiddenAlleles: ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    selection: testSelection,
    selectionChanged: function selectionChanged(gene, newValue) {
      testSelection[gene.name] = newValue;
      render();
    } }), document.getElementById('father-genome-test'));
}

function breed() {
  var times = clutchSize;
  clutch = [];
  while (times--) {
    var child = BioLogica.breed(mother, father);
    clutch.push(child);
    offspring.push(child);
  }
  render();
}

function toggleTest() {
  showingTest = !showingTest;
  var display = showingTest ? "block" : "none";
  document.getElementById("overlay").style.display = display;
  document.getElementById("test-wrapper").style.display = display;
}

function checkAnswer() {
  var allSelectedAlleles = [],
      alleleString = father.getAlleleString(),
      alleleStringLength = alleleString.length,
      testAllele = undefined,
      success = true;

  // hard-coded check to see if user has made all four choices
  if (Object.keys(testSelection).length !== 4) {
    alert("First make a selection for all four genes!");
    return;
  }

  var _loop = function _loop(geneName) {
    var alleles = father.species.geneList[geneName].alleles,
        selectedAlleles = testSelection[geneName].split(" ").map(function (num) {
      return alleles[num];
    });
    allSelectedAlleles = allSelectedAlleles.concat(selectedAlleles);
  };

  for (var geneName in testSelection) {
    _loop(geneName);
  }
  while (success && (testAllele = allSelectedAlleles.pop())) {
    alleleString = alleleString.replace(":" + testAllele, "");
    if (alleleString.length === alleleStringLength) {
      success = false;
    }
    alleleStringLength = alleleString.length;
  }
  var message = success ? "That's right!" : "Sorry, that's not right";
  alert(message);
}

document.getElementById("breed-button").onclick = breed;
document.getElementsByClassName("toggle-test-button")[0].onclick = toggleTest;
document.getElementsByClassName("toggle-test-button")[1].onclick = toggleTest;
document.getElementById("submit-button").onclick = checkAnswer;

render();
//# sourceMappingURL=data:application/json;base64,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QUFkLEVBQXdCLEtBQXhCLENBQThCLEdBQTlCLEVBQW1DLEdBQW5DLENBQXVDO2FBQU8sUUFBUSxHQUFSO0tBQVAsQ0FBekQ7QUFDTix5QkFBcUIsbUJBQW1CLE1BQW5CLENBQTBCLGVBQTFCLENBQXJCO0lBaEJtQjs7QUFhckIsT0FBSyxJQUFNLFFBQU4sSUFBa0IsYUFBdkIsRUFBc0M7VUFBM0IsVUFBMkI7R0FBdEM7QUFLQSxTQUFPLFlBQVksYUFBYSxtQkFBbUIsR0FBbkIsRUFBYixDQUFaLEVBQW9EO0FBQ3pELG1CQUFlLGFBQWEsT0FBYixPQUF5QixVQUF6QixFQUF1QyxFQUF2QyxDQUFmLENBRHlEO0FBRXpELFFBQUksYUFBYSxNQUFiLEtBQXdCLGtCQUF4QixFQUE0QztBQUM5QyxnQkFBVSxLQUFWLENBRDhDO0tBQWhEO0FBR0EseUJBQXFCLGFBQWEsTUFBYixDQUxvQztHQUEzRDtBQU9BLE1BQUksVUFBVSxVQUFVLGVBQVYsR0FBNEIseUJBQTVCLENBekJPO0FBMEJyQixRQUFNLE9BQU4sRUExQnFCO0NBQXZCOztBQTZCQSxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0MsT0FBeEMsR0FBa0QsS0FBbEQ7QUFDQSxTQUFTLHNCQUFULENBQWdDLG9CQUFoQyxFQUFzRCxDQUF0RCxFQUF5RCxPQUF6RCxHQUFtRSxVQUFuRTtBQUNBLFNBQVMsc0JBQVQsQ0FBZ0Msb0JBQWhDLEVBQXNELENBQXRELEVBQXlELE9BQXpELEdBQW1FLFVBQW5FO0FBQ0EsU0FBUyxjQUFULENBQXdCLGVBQXhCLEVBQXlDLE9BQXpDLEdBQW1ELFdBQW5EOztBQUVBIiwiZmlsZSI6ImNhc2UtNS9jYXNlLTUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmYXRoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBcImE6TSxhOmgsYjpoLGE6QyxiOkMsYTphLGI6YSxhOkIsYTpELGE6VyxhOmZsLGI6ZmwsYTpIbCxhOnQsYjpULGE6cmgsYTpCb2csYjpCb2dcIiwgMCk7XG5sZXQgICBtb3RoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBcImE6bSxiOk0sYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGI6QixhOkQsYjpELGE6dyxiOlcsYTpGbCxiOkZsLGE6SGwsYjpobCxhOlQsYjp0LGE6cmgsYjpyaCxhOkJvZyxiOkJvZ1wiLCAxKSxcbiAgICAgIG9mZnNwcmluZyA9IFtdLFxuICAgICAgY2x1dGNoID0gW10sXG4gICAgICBjbHV0Y2hTaXplID0gMjAsXG4gICAgICB0ZXN0U2VsZWN0aW9uID0ge30sXG4gICAgICBzaG93aW5nVGVzdCA9IGZhbHNlO1xuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIC8vIE1vdGhlciBvcmdcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5PcmdhbmlzbVZpZXcsIHtvcmc6IG1vdGhlcn0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3RoZXInKVxuICApO1xuICAvLyBGYXRoZXIgb3JnXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuT3JnYW5pc21WaWV3LCB7b3JnOiBmYXRoZXJ9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmF0aGVyJylcbiAgKTtcblxuICAvLyBNb3RoZXIgZ2Vub21lXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuR2Vub21lVmlldywge1xuICAgICAgb3JnOiBtb3RoZXIsXG4gICAgICBoaWRkZW5BbGxlbGVzOiBbJ3QnLCd0aycsJ2gnLCdjJywnYScsJ2InLCdkJywnYm9nJywncmgnXSxcbiAgICAgIGFsbGVsZUNoYW5nZWQ6IGZ1bmN0aW9uKGNocm9tLCBzaWRlLCBwcmV2QWxsZWxlLCBuZXdBbGxlbGUpIHtcbiAgICAgICAgbW90aGVyLmdlbmV0aWNzLmdlbm90eXBlLmNocm9tb3NvbWVzW2Nocm9tXVtzaWRlXS5hbGxlbGVzLnJlcGxhY2VGaXJzdChwcmV2QWxsZWxlLCBuZXdBbGxlbGUpO1xuICAgICAgICBtb3RoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBtb3RoZXIuZ2V0QWxsZWxlU3RyaW5nKCksIDEpO1xuICAgICAgICBjbHV0Y2ggPSBbXTtcbiAgICAgICAgb2Zmc3ByaW5nID0gW107XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfVxuICAgIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3RoZXItZ2Vub21lJylcbiAgKTtcblxuICAvLyBCcmVlZGluZyBwZW5cbiAgLyogZ2xvYmFsIFJlYWN0U2ltcGxlVGFicyAqL1xuICBjb25zdCByY2UgPSBSZWFjdC5jcmVhdGVFbGVtZW50LFxuICAgICAgICBUYWJzID0gUmVhY3RTaW1wbGVUYWJzO1xuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgcmNlKFRhYnMsIG51bGwsIFtcbiAgICAgIHJjZShUYWJzLlBhbmVsLCB7IHRpdGxlOiBcIkJyZWVkaW5nIFBlblwiLCBrZXk6IFwiQnJlZWRpbmcgUGVuXCIgfSxcbiAgICAgICAgcmNlKEdlbmlCbG9ja3MuUGVuVmlldywge29yZ3M6IGNsdXRjaH0pKSxcbiAgICAgIHJjZShUYWJzLlBhbmVsLCB7IHRpdGxlOiBcIlN0YXRzXCIsIGtleTogXCJTdGF0c1wiIH0sXG4gICAgICAgIHJjZShHZW5pQmxvY2tzLlN0YXRzVmlldywge29yZ3M6IG9mZnNwcmluZywgbGFzdENsdXRjaFNpemU6IGNsdXRjaFNpemV9KSlcbiAgICBdKSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnJlZWRpbmctcGVuJylcbiAgKTtcblxuICAvLyBGYXRoZXIgZ2Vub21lIHRlc3QgKGluIG92ZXJsYXkpXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuR2Vub21lVGVzdFZpZXcsIHtcbiAgICAgIG9yZzogZmF0aGVyLFxuICAgICAgaGlkZGVuQWxsZWxlczogWyd0JywndGsnLCdoJywnYycsJ2EnLCdiJywnZCcsJ2JvZycsJ3JoJ10sXG4gICAgICBzZWxlY3Rpb246IHRlc3RTZWxlY3Rpb24sXG4gICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IGZ1bmN0aW9uKGdlbmUsIG5ld1ZhbHVlKSB7XG4gICAgICAgICAgdGVzdFNlbGVjdGlvbltnZW5lLm5hbWVdID0gbmV3VmFsdWU7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9fSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdGhlci1nZW5vbWUtdGVzdCcpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGJyZWVkKCkge1xuICBsZXQgdGltZXMgPSBjbHV0Y2hTaXplO1xuICBjbHV0Y2ggPSBbXTtcbiAgd2hpbGUgKHRpbWVzLS0pIHtcbiAgICB2YXIgY2hpbGQgPSBCaW9Mb2dpY2EuYnJlZWQobW90aGVyLCBmYXRoZXIpO1xuICAgIGNsdXRjaC5wdXNoKGNoaWxkKTtcbiAgICBvZmZzcHJpbmcucHVzaChjaGlsZCk7XG4gIH1cbiAgcmVuZGVyKCk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVRlc3QoKSB7XG4gIHNob3dpbmdUZXN0ID0gIXNob3dpbmdUZXN0O1xuICB2YXIgZGlzcGxheSA9IHNob3dpbmdUZXN0ID8gXCJibG9ja1wiIDogXCJub25lXCI7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXN0LXdyYXBwZXJcIikuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrQW5zd2VyKCkge1xuICBsZXQgYWxsU2VsZWN0ZWRBbGxlbGVzID0gW10sXG4gICAgICBhbGxlbGVTdHJpbmcgPSBmYXRoZXIuZ2V0QWxsZWxlU3RyaW5nKCksXG4gICAgICBhbGxlbGVTdHJpbmdMZW5ndGggPSBhbGxlbGVTdHJpbmcubGVuZ3RoLFxuICAgICAgdGVzdEFsbGVsZSxcbiAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xuXG4gIC8vIGhhcmQtY29kZWQgY2hlY2sgdG8gc2VlIGlmIHVzZXIgaGFzIG1hZGUgYWxsIGZvdXIgY2hvaWNlc1xuICBpZiAoT2JqZWN0LmtleXModGVzdFNlbGVjdGlvbikubGVuZ3RoICE9PSA0KSB7XG4gICAgYWxlcnQoXCJGaXJzdCBtYWtlIGEgc2VsZWN0aW9uIGZvciBhbGwgZm91ciBnZW5lcyFcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yIChjb25zdCBnZW5lTmFtZSBpbiB0ZXN0U2VsZWN0aW9uKSB7XG4gICAgY29uc3QgYWxsZWxlcyA9IGZhdGhlci5zcGVjaWVzLmdlbmVMaXN0W2dlbmVOYW1lXS5hbGxlbGVzLFxuICAgICAgICAgIHNlbGVjdGVkQWxsZWxlcyA9IHRlc3RTZWxlY3Rpb25bZ2VuZU5hbWVdLnNwbGl0KFwiIFwiKS5tYXAobnVtID0+IGFsbGVsZXNbbnVtXSk7XG4gICAgYWxsU2VsZWN0ZWRBbGxlbGVzID0gYWxsU2VsZWN0ZWRBbGxlbGVzLmNvbmNhdChzZWxlY3RlZEFsbGVsZXMpO1xuICB9XG4gIHdoaWxlIChzdWNjZXNzICYmICh0ZXN0QWxsZWxlID0gYWxsU2VsZWN0ZWRBbGxlbGVzLnBvcCgpKSkge1xuICAgIGFsbGVsZVN0cmluZyA9IGFsbGVsZVN0cmluZy5yZXBsYWNlKGA6JHt0ZXN0QWxsZWxlfWAsIFwiXCIpO1xuICAgIGlmIChhbGxlbGVTdHJpbmcubGVuZ3RoID09PSBhbGxlbGVTdHJpbmdMZW5ndGgpIHtcbiAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICB9XG4gICAgYWxsZWxlU3RyaW5nTGVuZ3RoID0gYWxsZWxlU3RyaW5nLmxlbmd0aDtcbiAgfVxuICB2YXIgbWVzc2FnZSA9IHN1Y2Nlc3MgPyBcIlRoYXQncyByaWdodCFcIiA6IFwiU29ycnksIHRoYXQncyBub3QgcmlnaHRcIjtcbiAgYWxlcnQobWVzc2FnZSk7XG59XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJlZWQtYnV0dG9uXCIpLm9uY2xpY2sgPSBicmVlZDtcbmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0b2dnbGUtdGVzdC1idXR0b25cIilbMF0ub25jbGljayA9IHRvZ2dsZVRlc3Q7XG5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidG9nZ2xlLXRlc3QtYnV0dG9uXCIpWzFdLm9uY2xpY2sgPSB0b2dnbGVUZXN0O1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJtaXQtYnV0dG9uXCIpLm9uY2xpY2sgPSBjaGVja0Fuc3dlcjtcblxucmVuZGVyKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=