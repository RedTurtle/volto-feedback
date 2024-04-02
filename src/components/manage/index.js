import loadable from '@loadable/component';

/*--------------------------------
--- BOUNDLE VoltoFeedbackManage ---
---------------------------------*/
export const VFPanel = loadable(() =>
  import(/* webpackChunkName: "VoltoFeedbackManage" */ './VFPanel/VFPanel'),
);
export const VFPanelMenu = loadable(() =>
  import(/* webpackChunkName: "VoltoFeedbackManage" */ './VFPanel/VFPanelMenu'),
);
export const FeedbackComments = loadable(() =>
  import(
    /* webpackChunkName: "VoltoFeedbackManage" */ './VFPanel/FeedbackComments'
  ),
);
export const VFToolbar = loadable(() =>
  import(/* webpackChunkName: "VoltoFeedbackManage" */ './VFToolbar'),
);
