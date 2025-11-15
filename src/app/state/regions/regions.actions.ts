import { createAction, props } from '@ngrx/store';
import { District } from './regions.reducer';

export const loadRegions = createAction('[Regions] Load Regions');
export const loadRegionsSuccess = createAction('[Regions] Load Regions Success', props<{ districts: District[] }>());
export const loadRegionsFailure = createAction('[Regions] Load Regions Failure', props<{ error: unknown }>());
export const searchRegions = createAction('[Regions] Search Parishes', props<{ query: string }>());
export const searchRegionSuccess = createAction('[Regions] Search Parishes Success', props<{ districts: District[] }>());
export const searchRegionsFailure = createAction('[Regions] Search Parishes Failure', props<{ error: unknown }>());
