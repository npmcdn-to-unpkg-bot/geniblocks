let ChromosomeImageView = require('./chromosome-image'),
    filterAlleles = function(alleles, hiddenAlleles, species) {
      let hiddenGenes = hiddenAlleles.map( a => BioLogica.Genetics.getGeneOfAllele(species, a));
      return alleles.filter( a => {
        let gene = BioLogica.Genetics.getGeneOfAllele(species, a);
        return hiddenGenes.indexOf(gene) == -1;
      });
    },
    TestPulldownView = ({species, gene, selection, onSelectionChange}) => {
      let alleles = gene.alleles,
          alleleNames = alleles.map(a => species.alleleLabelMap[a]),
          numAlleles = alleleNames.length,
          possibleCombos = [],
          currentSelection = selection || "placeholder",
          i, j;

      possibleCombos.push(<option key="placeholder" value="placeholder" disabled="disabled">Select a Genotype</option>);

      for (i = 0; i < numAlleles; i++) {
        for (j = i; j < numAlleles; j++) {
          let key = i + " " + j,
              string = alleleNames[i] + " / " + alleleNames[j];
          possibleCombos.push(<option key={key} value={key}>{string}</option>);
        }
      }

      return (
        <select value={ currentSelection } onChange={ onSelectionChange }>
          { possibleCombos }
        </select>
      );
    };

const GenomeTestView = ({org, hiddenAlleles=[], selection={}, selectionChanged}) => {
  let pairWrappers = [];
  for (let chromosomeName of org.species.chromosomeNames) {
    let chrom = org.genetics.genotype.chromosomes[chromosomeName],
        alleles = chrom[Object.keys(chrom)[0]].alleles,
        visibleAlleles = filterAlleles(alleles, hiddenAlleles, org.species),
        genes = visibleAlleles.map(a => BioLogica.Genetics.getGeneOfAllele(org.species, a)),
        pulldowns = genes.map(g => {
          return (
            <TestPulldownView
              key       = { g.name }
              species   = { org.species }
              gene      = { g }
              selection = { selection[g.name] }
              onSelectionChange = { function(event) {
                selectionChanged(g, event.target.value);
              } }
            />
          );
        });

    pairWrappers.push(
      <div className="items">
        <ChromosomeImageView />
        <ChromosomeImageView />
        <div className="genome-test-options">
          { pulldowns }
        </div>
      </div>
    );
  }
  return (
    <div className="geniblocks genome-test">
      { pairWrappers }
    </div>
  );
}

export default GenomeTestView;