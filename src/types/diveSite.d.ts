type DiveSite = {
  type: "singleEntry",
  ident: "divesite",
  data: {
    properties: {
      id: string;
      name: string;
      lat: string;
      lng: string;
      loggedDives: string;
      averageRating: string;
      loggedUsers: string;
      averageMaxDepth: string;
      averageDivetime: string;
      averageVis: string;
      distanceToCenter: string;
      images: {
        type: string;
        ident: string;
        elements: {
          type: string;
          thumbnail: string;
          detail: string;
          huge: string;
          copyright: string;
        }[];
      };
      dcAffiliated: string;
      level: string[];
      country_iso3: string;
      wildlife: number[];
      URL: string;
    };
    text: {
      description1: string;
      description2: string;
    };
    _text_META: {
      description1: string;
      description2: string;
    };
  };
}

type DiveSiteResponse = {
  stats: {
    total: number;
  };
  result: {
    type: "collection",
    ident: "mixed",
    elements: DiveSite[]
  };
};
