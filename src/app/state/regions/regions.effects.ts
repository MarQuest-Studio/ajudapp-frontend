import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { RegionsService } from "../../core/services/regions.service";
import { loadRegions, loadRegionsFailure, loadRegionsSuccess, searchRegions } from "./regions.actions";

@Injectable()
export class RegionsEffects {

    readonly regionService = inject(RegionsService);
    readonly actions$ = inject(Actions);

    loadRegions$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadRegions),
            mergeMap(() => this.regionService.getRegions().pipe(
                map((data) => loadRegionsSuccess({ districts: data })),
                catchError((error: unknown) => of(loadRegionsFailure({ error })))
            ))
        )
    );

    searchRegions$ = createEffect(() => 
        this.actions$.pipe(
            ofType(searchRegions),
            mergeMap(({ query }) => this.regionService.searchRegions(query).pipe(
                map((data) => loadRegionsSuccess({ districts: data })),
                catchError((error: unknown) => of(loadRegionsFailure({ error })))
            ))
        )
    );
}