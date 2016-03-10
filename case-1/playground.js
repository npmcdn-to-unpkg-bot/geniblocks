"use strict";

var drake = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1),
    sexOfDrake = 1,
    sexOfDrakeLabel = 'female';

function render() {
  // change sex buttons
  ReactDOM.render(React.createElement(GeniBlocks.ChangeSexButtons, {
    sex: sexOfDrakeLabel,
    species: "Drake",
    showLabel: true,
    onChange: function onChange(evt, iSex) {
      sexOfDrakeLabel = iSex;
      sexOfDrake = iSex === 'male' ? 0 : 1;
      console.log("SexChange: " + drake.getAlleleString());
      drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), sexOfDrake);
      render();
    }
  }), document.getElementById('change-sex-buttons'));

  // genome
  ReactDOM.render(React.createElement(GeniBlocks.GenomeView, {
    org: drake,
    hiddenAlleles: ['t', 'tk', 'h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    style: { marginTop: 50, top: 50 },
    alleleChanged: function alleleChanged(chrom, side, prevAllele, newAllele) {
      drake.genetics.genotype.chromosomes[chrom][side].alleles.replaceFirst(prevAllele, newAllele);
      console.log("AlleleChange: " + drake.getAlleleString());
      drake = new BioLogica.Organism(BioLogica.Species.Drake, drake.getAlleleString(), sexOfDrake);
      render();
    }
  }), document.getElementById('drake-genome'));

  // drake
  ReactDOM.render(React.createElement(GeniBlocks.OrganismGlowView, { org: drake, color: '#FFFFAA', size: 200 }), document.getElementById('drake-image'));
}

document.getElementById("advance-button").onclick = function () {
  window.location.assign(window.location.href.replace("playground.html", "challenges.html?challenge=0"));
};

render();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhc2UtMS9wbGF5Z3JvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTSxRQUFRLElBQUksVUFBVSxRQUFWLENBQW1CLFVBQVUsT0FBVixDQUFrQixLQUFsQixFQUF5QiwyR0FBaEQsRUFBNkosQ0FBN0osQ0FBUjtJQUNBLGFBQWEsQ0FBYjtJQUNBLGtCQUFrQixRQUFsQjs7QUFFTixTQUFTLE1BQVQsR0FBa0I7O0FBRWhCLFdBQVMsTUFBVCxDQUNFLE1BQU0sYUFBTixDQUFvQixXQUFXLGdCQUFYLEVBQTZCO0FBQzNDLFNBQUssZUFBTDtBQUNBLGFBQVMsT0FBVDtBQUNBLGVBQVcsSUFBWDtBQUNBLGNBQVUsa0JBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0I7QUFDNUIsd0JBQWtCLElBQWxCLENBRDRCO0FBRTVCLG1CQUFhLFNBQVMsTUFBVCxHQUFrQixDQUFsQixHQUFzQixDQUF0QixDQUZlO0FBRzVCLGNBQVEsR0FBUixDQUFZLGdCQUFnQixNQUFNLGVBQU4sRUFBaEIsQ0FBWixDQUg0QjtBQUk1QixjQUFRLElBQUksVUFBVSxRQUFWLENBQW1CLFVBQVUsT0FBVixDQUFrQixLQUFsQixFQUF5QixNQUFNLGVBQU4sRUFBaEQsRUFBeUUsVUFBekUsQ0FBUixDQUo0QjtBQUs1QixlQUw0QjtLQUFwQjtHQUpoQixDQURGLEVBYUUsU0FBUyxjQUFULENBQXdCLG9CQUF4QixDQWJGOzs7QUFGZ0IsVUFtQmhCLENBQVMsTUFBVCxDQUNFLE1BQU0sYUFBTixDQUFvQixXQUFXLFVBQVgsRUFBdUI7QUFDekMsU0FBSyxLQUFMO0FBQ0EsbUJBQWUsQ0FBQyxHQUFELEVBQUssSUFBTCxFQUFVLEdBQVYsRUFBYyxHQUFkLEVBQWtCLEdBQWxCLEVBQXNCLEdBQXRCLEVBQTBCLEdBQTFCLEVBQThCLEtBQTlCLEVBQW9DLElBQXBDLENBQWY7QUFDQSxXQUFPLEVBQUMsV0FBVyxFQUFYLEVBQWUsS0FBSyxFQUFMLEVBQXZCO0FBQ0EsbUJBQWUsdUJBQVMsS0FBVCxFQUFnQixJQUFoQixFQUFzQixVQUF0QixFQUFrQyxTQUFsQyxFQUE2QztBQUMxRCxZQUFNLFFBQU4sQ0FBZSxRQUFmLENBQXdCLFdBQXhCLENBQW9DLEtBQXBDLEVBQTJDLElBQTNDLEVBQWlELE9BQWpELENBQXlELFlBQXpELENBQXNFLFVBQXRFLEVBQWtGLFNBQWxGLEVBRDBEO0FBRTFELGNBQVEsR0FBUixDQUFZLG1CQUFtQixNQUFNLGVBQU4sRUFBbkIsQ0FBWixDQUYwRDtBQUcxRCxjQUFRLElBQUksVUFBVSxRQUFWLENBQW1CLFVBQVUsT0FBVixDQUFrQixLQUFsQixFQUF5QixNQUFNLGVBQU4sRUFBaEQsRUFBeUUsVUFBekUsQ0FBUixDQUgwRDtBQUkxRCxlQUowRDtLQUE3QztHQUpqQixDQURGLEVBWUUsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBWkY7OztBQW5CZ0IsVUFtQ2hCLENBQVMsTUFBVCxDQUNFLE1BQU0sYUFBTixDQUFvQixXQUFXLGdCQUFYLEVBQTZCLEVBQUMsS0FBSyxLQUFMLEVBQVksT0FBTyxTQUFQLEVBQWtCLE1BQU0sR0FBTixFQUFoRixDQURGLEVBRUUsU0FBUyxjQUFULENBQXdCLGFBQXhCLENBRkYsRUFuQ2dCO0NBQWxCOztBQXdDQSxTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDLE9BQTFDLEdBQW9ELFlBQVc7QUFDN0QsU0FBTyxRQUFQLENBQWdCLE1BQWhCLENBQXVCLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixPQUFyQixDQUE2QixpQkFBN0IsRUFBZ0QsNkJBQWhELENBQXZCLEVBRDZEO0NBQVg7O0FBSXBEIiwiZmlsZSI6ImNhc2UtMS9wbGF5Z3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0ICAgZHJha2UgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBcImE6bSxiOk0sYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGI6QixhOkQsYjpELGE6dyxiOlcsYTpGbCxiOkZsLGE6SGwsYjpobCxhOlQsYjp0LGE6cmgsYjpyaCxhOkJvZyxiOkJvZ1wiLCAxKSxcbiAgICAgIHNleE9mRHJha2UgPSAxLFxuICAgICAgc2V4T2ZEcmFrZUxhYmVsID0gJ2ZlbWFsZSc7XG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgLy8gY2hhbmdlIHNleCBidXR0b25zXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuQ2hhbmdlU2V4QnV0dG9ucywge1xuICAgICAgICAgIHNleDogc2V4T2ZEcmFrZUxhYmVsLFxuICAgICAgICAgIHNwZWNpZXM6IFwiRHJha2VcIixcbiAgICAgICAgICBzaG93TGFiZWw6IHRydWUsXG4gICAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uKGV2dCwgaVNleCkge1xuICAgICAgICAgICAgc2V4T2ZEcmFrZUxhYmVsID0gaVNleDtcbiAgICAgICAgICAgIHNleE9mRHJha2UgPSBpU2V4ID09PSAnbWFsZScgPyAwIDogMTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2V4Q2hhbmdlOiBcIiArIGRyYWtlLmdldEFsbGVsZVN0cmluZygpKTtcbiAgICAgICAgICAgIGRyYWtlID0gbmV3IEJpb0xvZ2ljYS5PcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgZHJha2UuZ2V0QWxsZWxlU3RyaW5nKCksIHNleE9mRHJha2UpO1xuICAgICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhbmdlLXNleC1idXR0b25zJylcbiAgKTtcblxuICAvLyBnZW5vbWVcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5HZW5vbWVWaWV3LCB7XG4gICAgICBvcmc6IGRyYWtlLFxuICAgICAgaGlkZGVuQWxsZWxlczogWyd0JywndGsnLCdoJywnYycsJ2EnLCdiJywnZCcsJ2JvZycsJ3JoJ10sXG4gICAgICBzdHlsZToge21hcmdpblRvcDogNTAsIHRvcDogNTB9LFxuICAgICAgYWxsZWxlQ2hhbmdlZDogZnVuY3Rpb24oY2hyb20sIHNpZGUsIHByZXZBbGxlbGUsIG5ld0FsbGVsZSkge1xuICAgICAgICBkcmFrZS5nZW5ldGljcy5nZW5vdHlwZS5jaHJvbW9zb21lc1tjaHJvbV1bc2lkZV0uYWxsZWxlcy5yZXBsYWNlRmlyc3QocHJldkFsbGVsZSwgbmV3QWxsZWxlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJBbGxlbGVDaGFuZ2U6IFwiICsgZHJha2UuZ2V0QWxsZWxlU3RyaW5nKCkpO1xuICAgICAgICBkcmFrZSA9IG5ldyBCaW9Mb2dpY2EuT3JnYW5pc20oQmlvTG9naWNhLlNwZWNpZXMuRHJha2UsIGRyYWtlLmdldEFsbGVsZVN0cmluZygpLCBzZXhPZkRyYWtlKTtcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9XG4gICAgfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWtlLWdlbm9tZScpXG4gICk7XG5cbiAgLy8gZHJha2VcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5PcmdhbmlzbUdsb3dWaWV3LCB7b3JnOiBkcmFrZSwgY29sb3I6ICcjRkZGRkFBJywgc2l6ZTogMjAwfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWtlLWltYWdlJykpO1xufVxuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkdmFuY2UtYnV0dG9uXCIpLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKFwicGxheWdyb3VuZC5odG1sXCIsIFwiY2hhbGxlbmdlcy5odG1sP2NoYWxsZW5nZT0wXCIpKTtcbn07XG5cbnJlbmRlcigpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
