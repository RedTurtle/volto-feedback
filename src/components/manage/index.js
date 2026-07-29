import loadable from '@loadable/component';

/*--------------------------------
--- Toolbar ---
--- Mounted on every route via appExtras (match: ''), so it must stay
--- synchronous: VFToolbar's own permission check (state.actions.actions)
--- only runs once mounted, and it has no heavy deps (Icon, Plug,
--- react-intl, react-router-dom Link are already in the main bundle), so
--- there's nothing to gain from a separate chunk/network round-trip here.
---------------------------------*/
export { VFToolbar } from './VFToolbar';

/*--------------------------------
--- BUNDLE VoltoFeedbackManage ---
--- Only opened from the toolbar above once a manage-capable user is
--- confirmed, so it's safe to keep these lazy in their own chunk.
---------------------------------*/
export const VFPanel = loadable(
  () =>
    import(/* webpackChunkName: "VoltoFeedbackManage" */ './VFPanel/VFPanel'),
);
export const VFPanelMenu = loadable(
  () =>
    import(
      /* webpackChunkName: "VoltoFeedbackManage" */ './VFPanel/VFPanelMenu'
    ),
);
export const FeedbackComments = loadable(
  () =>
    import(
      /* webpackChunkName: "VoltoFeedbackManage" */ './VFPanel/FeedbackComments'
    ),
);
