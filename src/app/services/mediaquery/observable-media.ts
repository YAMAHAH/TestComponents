/**
 * Base class for MediaService and pseudo-token for
 */
import { Subscribable, Observable } from 'rxjs/Observable';
import { MediaChange } from './media-change';
import { Subscription } from 'rxjs/Subscription';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { Injectable } from '@angular/core';
import { MatchMedia } from './match-media';
import { BreakPoint } from './breakpoints/break-point';
import { mergeAlias } from './utils/add-alias';

export abstract class ObservableMedia implements Subscribable<MediaChange> {
    abstract isActive(query: string): boolean;

    abstract asObservable(): Observable<MediaChange>;

    abstract subscribe(next?: (value: MediaChange) => void,
        error?: (error: any) => void,
        complete?: () => void): Subscription;
}

@Injectable()
export class MediaService implements ObservableMedia {
    /**
       * Should we announce gt-<xxx> breakpoint activations ?
       */
    filterOverlaps = true;

    constructor(private breakpoints: BreakPointRegistry,
        private mediaWatcher: MatchMedia) {
        this._registerBreakPoints();
        this.observable$ = this._buildObservable();
    }

    /**
     * Test if specified query/alias is active.
     */
    isActive(alias: string): boolean {
        let query = this._toMediaQuery(alias);
        return this.mediaWatcher.isActive(query);
    }

    /**
     * Proxy to the Observable subscribe method
     */
    subscribe(next?: (value: MediaChange) => void,
        error?: (error: any) => void,
        complete?: () => void): Subscription {
        return this.observable$.subscribe(next, error, complete);
    }

    /**
     * Access to observable for use with operators like
     * .filter(), .map(), etc.
     */
    asObservable(): Observable<MediaChange> {
        return this.observable$;
    }

    // ************************************************
    // Internal Methods
    // ************************************************

    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     */
    private _registerBreakPoints() {
        let queries = this.breakpoints.sortedItems.map(bp => bp.mediaQuery);
        this.mediaWatcher.registerQuery(queries);
    }

    /**
     * Prepare internal observable
     *
     * NOTE: the raw MediaChange events [from MatchMedia] do not
     *       contain important alias information; as such this info
     *       must be injected into the MediaChange
     */
    private _buildObservable(): Observable<MediaChange> {
        const self = this;
        const media$ = this.mediaWatcher.observe();
        const activationsOnly = (change: MediaChange) => {
            return change.matches === true;
        };
        const addAliasInformation = (change: MediaChange) => {
            return mergeAlias(change, this._findByQuery(change.mediaQuery));
        };
        const excludeOverlaps = (change: MediaChange) => {
            let bp = this.breakpoints.findByQuery(change.mediaQuery);
            return !bp ? true : !(self.filterOverlaps && bp.overlapping);
        };

        /**
         * Only pass/announce activations (not de-activations)
         * Inject associated (if any) alias information into the MediaChange event
         * Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
         */
        return media$.pipe(
            a => a.filter(activationsOnly),
            b => b.filter(excludeOverlaps),
            c => c.map(addAliasInformation));
    }

    /**
     * Breakpoint locator by alias
     */
    private _findByAlias(alias: string) {
        return this.breakpoints.findByAlias(alias);
    }

    /**
     * Breakpoint locator by mediaQuery
     */
    private _findByQuery(query: string) {
        return this.breakpoints.findByQuery(query);
    }

    /**
     * Find associated breakpoint (if any)
     */
    private _toMediaQuery(query: string) {
        let bp: BreakPoint | null = this._findByAlias(query) || this._findByQuery(query);
        return bp ? bp.mediaQuery : query;
    }

    private observable$: Observable<MediaChange>;
}
