(function($) {
 /**
   *
   * This plugin is released under the MIT Licene (http://opensource.org/licenses/MIT)
   *
   * RoyalSlider HTML5 HistoryApi Plugin by Conrad Barthelmes
   * 
   * @requires RoyalSlider http://dimsemenov.com/plugins/royal-slider/
   * @requires History.js API https://github.com/balupton/History.js/ 
   * - bundled jquery.history.js for html4+html5 support
   * 
   * 
   * @version 0.1 - 2013-01-14
   *
   */ 
  $.extend($.rsProto, {
    
  _initHistoryApi: function() {
      
    var self       = this,
        baseTitle  = document.title,            // the original page title, might be needed for changing titles later
        slides     = [];                        // keeps an obj with id and attrUrl for identification with RS
      
      self.rsHistory = window.History;            // History object stored in the RS instance for better extensibility from the History.js API
    
    self._historyDefaults = {
        enabled  : true,                          // enables the plugin
                
        baseUri  : '/',                           // when you're dealing with human-readable uri's with slashes like /portfolio/web/
                                                  // and load this page intially, all other paths will be attached and /portfolio/web/ is not replaced,
                                                  // so change this to your actual base uri where the slider is
        
        dataAttr : {
          
          uri    : 'history-uri',                 // slides should keep an data-{history-uri}="about-me" 
                                                  // attribute with their target uri, otherwise id "?slide={id}"will be used as default
                                              
          title  : 'history-title',               // slides can keep an data-{history-title}="About me" 
                                                  // attribute with their target page title which can be changed too
                                                  // leave empty in slide or leave out for no title change
                                              
          data   : 'history-data'                 // some custom data in json format or an js-object that can be used elsewhere           
                                                  // data-{history-data}='{ "my":"data", "is":["super","flexible"]}'
                                                  // NOTE: be sure to enter it with single colons and use double quotes for 
                                                  //       properties and all values to have jQuery read it as an object
                                              
        },

        title: {
          
          prefix      : false,                    // you may set a title prefix when changing titles with dataAttr.title
          
          keepOriginal: true                      // whether or not to keep the original title, add a prefix to have all three
                                                  // {originalTitle}{prefix}{slideTitle}
          
        },
                      
        callbacks: {
          afterPushState: function(pushData) {},  // 
          stateChange   : function(state) {}      // stateChange callback after the state has changed with the history.js state object
        }
      };

      // merge deep recursively
      self.st.historyOptions = $.extend(true, {}, self._historyDefaults, self.st.historyOptions);

      if(self.st.historyOptions.enabled) {

        if(!self.rsHistory.enabled) {
          // History.js is disabled for this browser.
          // This is because we can optionally choose to support HTML4 browsers or not.
          // @see https://github.com/balupton/History.js/
          return false;
        }
        
        // build slides array after initialization
        self.ev.on('rsAfterInit', function(ev) {
          
          var uri, i;
          // build slides array with uris to match their id
          for(i = 0; i < self.slides.length; i++) {
            
            uri = self.slides[i].content.data(self.st.historyOptions.dataAttr.uri);
            // fill with default value
            if(uri == undefined) {
              uri = '?slide='+i
            }
            slides.push({
              uri : uri
            });
          }
          
          // now check if a current id is running and show it :)
          var currentUri = document.location.pathname.replace(self.st.historyOptions.baseUri, '');
          for(i = 0; i < slides.length; i++) {
            // load found url                 // or default one
            if(slides[i].uri == currentUri || slides[i].uri == document.location.search) {
              // other way to go directly to desired slide instead of changing speed?
              var transitionSpeed     = self.st.transitionSpeed;
              self.st.transitionSpeed = 0;
              self.goTo(i);
              self.st.transitionSpeed = transitionSpeed;
            }
          }
          
        });
        
        // the actual statechange event to show the slides
        self.rsHistory.Adapter.bind(window, 'statechange', function() {
          
          var state = self.rsHistory.getState();

          for(var i = 0; i < slides.length; i++) {
            if(slides[i].uri == state.data.uri) {
              self.goTo(i);
            }
          }
          
          self.st.historyOptions.callbacks.stateChange(state);
          
        });
        
        // update the history before an animation
        self.ev.on('rsBeforeAnimStart', function(ev) {
          
          var currentSlide  = this.currSlide.content,                                     // jquery slide object
              historyData   = currentSlide.data(self.st.historyOptions.dataAttr.data),    // the custom data
              historyUri    = slides[this.currSlideId].uri,                               // the custom uri-part
              historyUrl,                                                                 // the whole url
              historyTitle  = currentSlide.data(self.st.historyOptions.dataAttr.title),   // the title
              pushData;                                                                   // the pushed data
              
          // missing data attribute filling with null
          if(historyData == undefined) {
            historyData = null;
          }
          
          // add baseUri because pushState replaces everything
          historyUrl  = self.st.historyOptions.baseUri + historyUri;
              
          // missing title attribute filling with default one
          if(historyTitle == undefined) {
            historyTitle = baseTitle;
          }else{
            // check for prefix and add it if avaiable
            if(self.st.historyOptions.title.prefix) {
              historyTitle = self.st.historyOptions.title.prefix+historyTitle;
            }
            // add the original title if wanted
            if(self.st.historyOptions.title.keepOriginal) {
              historyTitle = baseTitle + historyTitle;
            }
          }
        
          pushData = { 
            slide:  this.currSlideId,     // the slide's id
            title:  historyTitle,         // the pushed page title
            uri:    historyUri,           // NOTE: historyUri (only the custom path),
            url:    historyUrl,           // NOTE: historsUrl (the whole path)
            data:   historyData           // the custom history data 
          };
        
          // push the new page to the history stack
          self.rsHistory.pushState(
            pushData, 
            historyTitle,  // the new title
            historyUrl     // NOTE: historyUrl (the whole path)
          );
          
          // call callback after pushing state
          self.st.historyOptions.callbacks.afterPushState(pushData);
          
        });
        
      }
    }
  });
  $.rsModules.historyApi = $.rsProto._initHistoryApi;
})(jQuery);


////////////////////////////////////////////////////////////////////////
// Usage:
///////////////////////////////////////////////////////////////////////

var slider = $('.royalSlider').royalSlider({
  
  keyboardNavEnabled: true,
  loop: true,
  historyOptions: {
    enabled           : true,
    baseUri           : '/my-subfolder/with/gallery/',
    dataAttr          : {               // customize them when needed
      uri             : 'history-uri',
      title           : 'history-title',
      data            : 'history-data'
    },
    title             : {
      prefix          : ' - ',
      keepOriginal    : true
    },
    callbacks: {
      afterPushState: function(pushData) {
        // do something after the pushState action
      }, 
      stateChange   : function(state) {
        // do something after the stateChange event
      }
    }
  }

}).data('royalSlider');