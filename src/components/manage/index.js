import loadable from '@loadable/component';

/*--------------------------------
--- BUNDLE VoltoFeedbackManage ---
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
export const VFToolbar = loadable(
  () => import(/* webpackChunkName: "VoltoFeedbackView" */ './VFToolbar'), //questo è stato messo in VoltoFeedbackView altrimenti se lo mettiamo in VoltoFeedbackManage viene giu tutto il bundle VoltoFeedbackManage anche da anonimo, perchè questo componente è caricato con appExtras per il path ''
);
