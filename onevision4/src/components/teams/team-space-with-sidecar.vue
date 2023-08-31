<!-- 暂时没用到  TBD -->
<template>
    <div class="team-space-with-sidecar" >
        <teams-header :active="active" />
        <SplitGrid class="teams-middle-content" direction="column" sizeUnit="px" :snapOffset="0" :dragInterval="0"
        :gutterSize="4" :columnMinSizes="{ 2: 344 }">
            <SplitGridArea class="teams-middle-content-l" :transition="transition" :strictMode="false">
                <team-space
                        
                    :id="id" 
                    :spaceName="spaceName" 
                    :isSpace="isSpace"
                    :isFav="isFav"
                    :isPersonal="isPersonal" 
                    :team="team" 
                    :teamColor="teamColor"
                    :spaceSize="spaceSize" 
                    :cover="cover" 
                    :coverExpanded="coverExpanded"
                    :statusTxt="statusTxt" 
                    :people="people" 
                    :content="content"
                    :meetings="meetings" 
                    :seenby="seenby" 
                    :newRepliesButtonVisible="newRepliesButtonVisible" 
                    :scrollY="scrollY" 
                    :newRepliesScrollY="newRepliesScrollY" 
                    />
            </SplitGridArea>

            <SplitGridGutter :show="(teamsSidecarName != null && !gptPanelPopouted) || meetingsSidecarVisible"
            class="vsg_gutter_v sidecar-slider" :transition="transition" />

            <SplitGridArea :show="(teamsSidecarName != null && !gptPanelPopouted) || meetingsSidecarVisible"
                class="teams-middle-content-r sidecar" sizeUnit="px" :sizeValue="sidecarMinWidth" :transition="transition"
                :strictMode="false">

                <panel-gpt v-if="teamsSidecarName && !gptPanelPopouted && !meetingsSidecarVisible" :meetingId="null" :onloadFuncName="gptPanelOnloadFuncName"></panel-gpt>

            </SplitGridArea>
        
        </SplitGrid>
    </div>
  </template>
  
  <script>
  
  export default {
    props:{
      parentRect: { // data comes from Windows.vue, WindowsContainer.vue
        type: DOMRect
      },
      active: { // data comes from Windows.vue, WindowsContainer.vue
        type: Boolean,
        default: true,
      },
      isPopout: Boolean,
      isFav: Boolean,
      id: String,
      spaceName: String,
      isPersonal: Boolean,
      isSpace: Boolean,
      team: String,
      statusTxt: String,
      teamColor: Object,
      cover: Number,
      coverExpanded: Boolean,
      spaceSize: {
        type: String,
        default: 'normal',
      },
      people: Array,
      content: Object,
      meetings: Array,
      seenby: Array,
      newRepliesButtonVisible: Boolean,
      scrollY: Number,
      newRepliesScrollY: Number,
    },
    data() {
      return {
      };
    },
    computed: {
      os() {
        return this.$store.state.os;
      },
      theme() {
        return this.$store.state.theme;
      },
    },
    mounted() {
  
    },
    watch: {
  
    },
    methods: {
  
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .team-space-with-sidecar {

  


  }
  </style>
  