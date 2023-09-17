
export type TsGeoPoint = {
  type: 'Point';
  coordinates: [number, number];
}

export type TsFeature = {
  id?: string;
  type: 'Feature';
  geometry: TsGeoPoint;
  properties: TsProperties;
}

export type TsFeatureCollection = {
  type: 'FeatureCollection';
  features: TsFeature[];
  bbox?: TsBoundingBox;
}



export type TsCoordinate = [number, number];
export type TsLngLat = {lat: number, lng: number};
export type TsBoundingBox = [number, number, number, number] | undefined;

export type TsVizProps = {
  siteId: string;
  visibility: number,
  timestamp: Date,
  comments: string,
  userName: string,
  userId: string
}

export type TsSiteType = 'wreck' | 'reef';

export type TsSiteProps = {
  siteName: string,
  siteType: TsSiteType,
  siteDescription: string,
  userName: string,
  userId: string,
  status: [TsStatus]
}

export type TsStatus = {
  visibility?: number,
  vizDate?: Date,
  userId: string,
  userName: string,
  comments: string
}

export type TsProperties = TsSiteProps;

export type TsMapView = {
  centre: TsLngLat,
  zoom: number,
  bounds: TsBoundingBox
}





