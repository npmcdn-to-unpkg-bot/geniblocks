const OrganismView = ({org, width=200}) => {
  let baseUrl = "https://geniverse-resources.concord.org/resources/drakes/images/",
      url     = baseUrl+ org.getImageName();

  return (
    <div className="geniblocks organism">
      <img src={url} width={width}/>
    </div>
  );
}

export default OrganismView;
