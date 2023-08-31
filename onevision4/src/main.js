import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Store from './data.js'

const WINDOWS_ROOT_ELEMENT_SELECTOR = '#windows-container-root';

import globalFunc from './utils/globalFunc';
Vue.use(globalFunc);

import Momentum from '@wzpo/md-ui'
Vue.use(Momentum)

import vwindow from './controls/wl-window/index.js';
Vue.use(vwindow, {
  parentElementSelector: WINDOWS_ROOT_ELEMENT_SELECTOR,
});

import vmodal from './controls/wl-modal/index.js';
Vue.use(vmodal, {
  parentElementSelector: WINDOWS_ROOT_ELEMENT_SELECTOR,
});

import vpopper from './controls/wl-popper/index.js';
Vue.use(vpopper);

import vtooltip from './controls/wl-tooltip/index.js'
Vue.use(vtooltip, {
  defaultOffset: 2,
});

import VueNotification from './controls/wl-notification/index.js'
Vue.use(VueNotification);

import dragresize from './controls/drag-resize/vue-drag-resize.vue';
Vue.component('drag-resize', dragresize);

import VueSplitGrid from './controls/split-grid/vue-split-grid.js';
Vue.use(VueSplitGrid);

import PortalVue from 'portal-vue'
Vue.use(PortalVue)

import { Fragment } from 'vue-fragment';
Vue.component('fragment', Fragment);

import highlightText from 'vue-highlight-text';
Vue.component('highlight-text', highlightText);

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

//comp
import tipmessage from './controls/tip-message.vue';
import wlaccordion from './controls/wl-accordion.vue';
import wlscrollbar from './controls/wl-scrollbar/wl-scrollbar.vue';
import wlhot from './controls/wl-hot.vue';
import wlicon from './controls/wl-icon.vue';
import calendar from './controls/wl-calendar.vue';
import wlcombobox from './controls/wl-combobox.vue';
import wlalertbanner from './controls/wl-alertbanner.vue';

// comp
Vue.component('tip-message', tipmessage);
Vue.component('wl-accordion', wlaccordion);
Vue.component('wl-scrollbar', wlscrollbar);
Vue.component('wl-hot', wlhot);
Vue.component('wl-icon', wlicon);
Vue.component('wl-calendar', calendar);
Vue.component('wl-combobox', wlcombobox);
Vue.component('wl-alertbanner', wlalertbanner);

// meeting
// meeting

///*

import lobby from './components/lobby.vue';
Vue.component('lobby', lobby);

//*/

Vue.filter('assetpath', function (value) {
  return require('@/assets/' + value)
})

///*

import controls from './components/meeting/controls.vue';
import controlsmeet from './components/meeting/controls-meet.vue';
import controlsdevice from './components/meeting/controls-device.vue';
import layoutSwitch from './components/meeting/layout-switch.vue';
import videoZoomSlider from './components/meeting/video-zoom-slider.vue';
import statusindicator from './components/meeting/status-indicator.vue';
import speakingbubble from './components/meeting/speaking-bubble.vue';

import videopane from './components/meeting/video-pane.vue';
import sharingpane from './components/meeting/sharing-pane.vue';
import sharingsection from './components/meeting/sharing-section.vue';
import videoitem from './components/meeting/video-item.vue';
import selfvideo from './components/meeting/self-video.vue';
import panelheader from './components/meeting/panel-header.vue';
import panelplist from './components/meeting/panel-plist.vue';
import panelchat from './components/meeting/panel-chat.vue';
import panelapps from './components/meeting/panel-apps.vue';
import panelappstpl from './components/meeting/panel-apps-tpl.vue';
import panelcc from './components/meeting/panel-cc.vue';
import panelsharestage from './components/meeting/panel-share-stage.vue';
import panelgpt from './components/meeting/panel-gpt.vue';
import panelcontent from './components/meeting/panel-content.vue';
import fit from './components/meeting/fit.vue';
import pip from './components/meeting/pip.vue';
import whiteboard from './components/meeting/whiteboard.vue';
import ccbox from './components/meeting/cc-box.vue';
import ccboxinside from './components/meeting/cc-box-inside.vue';


Vue.component('controls', controls);
Vue.component('controls-meet', controlsmeet);
Vue.component('controls-device', controlsdevice);
Vue.component('layout-switch',layoutSwitch);
Vue.component('video-zoom-slider',videoZoomSlider);
Vue.component('status-indicator',statusindicator);
Vue.component('speaking-bubble',speakingbubble);
Vue.component('panel-header', panelheader);
Vue.component('panel-plist', panelplist);
Vue.component('panel-chat', panelchat);
Vue.component('panel-apps', panelapps);
Vue.component('panel-apps-tpl', panelappstpl);
Vue.component('panel-cc', panelcc);
Vue.component('panel-share-stage', panelsharestage);
Vue.component('panel-gpt', panelgpt);
Vue.component('panel-content', panelcontent);

Vue.component('video-pane', videopane);
Vue.component('sharing-pane', sharingpane);
Vue.component('sharing-section', sharingsection);
Vue.component('video-item', videoitem);
Vue.component('self-video', selfvideo);

Vue.component('fit', fit);
Vue.component('pip', pip);
Vue.component('whiteboard', whiteboard);

Vue.component('cc-box', ccbox);
Vue.component('cc-box-inside', ccboxinside);
//*/

// reaction

import reactionstack from './components/reaction-stack.vue';
import reactionitem from './components/reaction-item.vue';
//import reactioncombo from './components/reaction-combo.vue';

Vue.component('reaction-stack',reactionstack);
Vue.component('reaction-item',reactionitem);
//Vue.component('reaction-combo',reactioncombo);

// teams
///*

import teamnav from './components/teams/team-nav.vue';
import teamheader from './components/teams/team-header.vue';

import team2ndcolumnmessage from './components/teams/team-2nd-column-message.vue';
import team2ndcolumncontacts from './components/teams/team-2nd-column-contacts.vue';

import teamsmessagingheader from './components/teams/team-2nd-column-message-header.vue';
import teamscontactsheader from './components/teams/team-2nd-column-contacts-header.vue';
import teamcalling from './components/teams/team-calling.vue';
import teamspace from './components/teams/team-space.vue';
import teamspaceheader from './components/teams/team-space-header.vue';
import teamspacepeople from './components/teams/team-space-people.vue';
import teamspacecontent from './components/teams/team-space-content.vue';
import teamspacemeetings from './components/teams/team-space-meetings.vue';
import teamspacepublichome from './components/teams/team-spcae-public-home.vue';
import teamteams from './components/teams/team-teams.vue';
import teamempty from './components/teams/team-empty.vue';
import teamteamsheader from './components/teams/team-teams-header.vue';
import teammeetings from './components/teams/team-meetings.vue';
import teammeetingdetails from './components/teams/team-meeting-details.vue';
import callitemgroup from './components/teams/call-item-group.vue';
import callitem from './components/teams/call-item.vue';
import teamcontactdetails from './components/teams/team-contact-details.vue';
import recordingreel from './components/teams/recording-reel.vue';


Vue.component('team-nav',teamnav);
Vue.component('teams-header',teamheader);

Vue.component('team-2nd-column-message',team2ndcolumnmessage);
Vue.component('team-2nd-column-contacts',team2ndcolumncontacts);

Vue.component('team-2nd-column-message-header',teamsmessagingheader);
Vue.component('team-2nd-column-contacts-header',teamscontactsheader);
Vue.component('team-calling',teamcalling);
Vue.component('team-space',teamspace);
Vue.component('team-space-header',teamspaceheader);
Vue.component('team-space-people',teamspacepeople);
Vue.component('team-space-content',teamspacecontent);
Vue.component('team-space-meetings',teamspacemeetings);
Vue.component('team-spcae-public-home',teamspacepublichome);
Vue.component('team-teams',teamteams);
Vue.component('team-empty',teamempty);
Vue.component('team-teams-header',teamteamsheader);
Vue.component('team-meetings',teammeetings);
Vue.component('team-meeting-details',teammeetingdetails);
Vue.component('call-item-group',callitemgroup);
Vue.component('call-item',callitem);
Vue.component('team-contact-details',teamcontactdetails);
Vue.component('recording-reel',recordingreel);

//*/

// shared
import topbar from './components/shared//topbar.vue';
import topbarS from './components/shared//topbar-simple.vue';
import chatitem from './components/shared/chat-item.vue';
import aimsgitem from './components/shared/ai-msg-item.vue';
import peopleitem from './components/shared/people-item.vue';
import notificationcontainer from './components/shared/notification-container.vue';
import statusavatar from './components/shared/presence-avatar.vue';
import windowcontrols from './components/shared/window-controls.vue';
import spacepeopleitem from './components/shared/space-people-item.vue';
//import typingloader from './components/shared/typing-loader.vue';
import contentloader from './components/shared/content-loader.vue';
import typingstring from './components/shared/typing-string.vue';
import videoplayer from './components/shared/video-player.vue';


Vue.component('topbar', topbar);
Vue.component('topbar-simple', topbarS);
Vue.component('chat-item', chatitem);
Vue.component('ai-msg-item', aimsgitem);
Vue.component('people-item',peopleitem);
Vue.component('notification-container', notificationcontainer);
Vue.component('presence-avatar',statusavatar);
Vue.component('window-controls',windowcontrols);
Vue.component('space-people-item',spacepeopleitem);
//Vue.component('typing-loader',typingloader);
Vue.component('content-loader',contentloader);
Vue.component('typing-string',typingstring);
Vue.component('video-player',videoplayer);


import miro from './components/shared/miro.vue';
Vue.component('miro',miro);

Vue.prototype.$eventBus = new Vue()

Vue.config.productionTip = false

Vue.use(Vuex);
const store = new Vuex.Store(Store);

import axios from 'axios';
import qs from 'qs';
Vue.prototype.$ajax=axios;
Vue.prototype.$qs=qs;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
