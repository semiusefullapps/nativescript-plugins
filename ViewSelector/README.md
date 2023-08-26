///////////////////////////////////////////////////////////////////////////////
//  IMPORTANT: To see the Sample and how to use this plugin:
//             ns create myCoolApp --js 
//             download and unzip the app.zip and replace the app folder in myCoolApp
//             Explore the source and run the app to see some of what the ViewSelector 
//             can do.
//
//
//   Plugin is still in development
//   The Selector class is as of this code stable.
//   I've made this class to be the primary views inside the the actual plugin 
//   I'm going to Make; wich will be a ViewSelector.
//
//   So far this Selector (though not intended to be just by itself I guess can 
//   be usefull in certain situations the propertys can all be used in 
//   code or xml without issue. the propertys:
//     view 
//     selected
//     selectedBox
//     selectedColor
//     unSelectedWidth
//     selectedWidth
//     spliter 
//     fontSize 
//     textColor   
//     labels
//     color 
//
//     ****************************************
//     borderColor // Overwritten
//     hAlignment // HoriztonalAlignment
//     vAlignment // verticalAlignment
//     ****************************************
//     NOTE: I am seeking a way to be able to implement my own version of the
//           above three propertys, but without loosing there inherited behavore. 
//           Any Help on this would be greatly Appreciated).
//
//     NOTE: That the way I defined all these propertys was by using the
//           "property=Property" and "property.Register(View)" (( This is in v7Docs ))
//           but in the getters and setters I use _getValue and _setValue,
//           which I learned about from AIChatGPT. 
//           (( _getValue and _setValue are not in the docs [that I'm aware of]. )) 
//            
//           With alot of testing I found that the only way for .notify 
//           or .notifyPropertyChange to have anyaffect on an "property.on" 
//           is with the _getValue and _setValue present in the getters and setters.
//
//     NOTE: Studio Code Intelicode has informed me that this system of 
//           writeing Propertys and the use of _getValue and _setValue are 
//           outdated and that a "new property system is in place" and suggest
//           revision of code. 
//
//           Will someone please answer these question,... Is there a newer, and
//           or better way to be writeing propertys for a plugin? Would I just be 
//           better off writeing the regular get / set ()=> return _get / _set?
//
//           the way I've currently implemented the code; anyone that is uses it 
//           (makeing it third party) could attach there own .on events to any one of these 
//           propertys without needing there implemetation. unfortunately I am 
//           un-aware of a way to add my own .on event to inhertied propertys 
//           such as borderColor, fontSize, etc... is there a way to do so. 
//           ( v7 docs describe a method but I expermented with it for hours and 
//             was unable to accomplish it.)
//            
//     UPDATE: Still looking for the same answers to the same questions, I know everyones
//             busy, but this would realy help me out a lot.
//             I've rewritten the code entirely without registering the propertys, I had
//             to write extra propertys to handle propertys that I should have just been able 
//             to inherit from. (Again please : 5 minuts is all it would take from someone
//             in the know. 
//
//             The ViewSelector class is written and works brillantly. As far as I can tell 
//             way far superior to a tab view. When the widget is understood it is easly 
//             implemented, smooth and highly customizable with Font-Awsome and utility 
//             function for richtextbinding. I'll be useing this in all my apps from here on
//             unless someone can show me something better. 
//             
//             I hope NS community can make use of it, and by all means make it better,...
//             run with it. Let me know what you think, and send it back to
//             me 100x improved. NativeScript is awsome - lets keep it shineing.
//
//             I will also post a better sample usage when next I push to GH
//
//   example usage:
//     css file:
//       @font-face {
//         font-family: "FontAwesome";
//         src: url('~/fontawesome-webfont.ttf');
//       }
//      
//       .fab {
//         font-family: 'Font Awesome 6 Brands', 'fa-brands-400';
//         font-weight: 400;
//       }
//      
//       .fas {
//         font-family: 'Font Awesome 6 Free', 'fa-solid-900';
//         font-weight: 900;
//       }
//      
//       .far {
//         font-family: 'Font Awesome 6 Free', 'fa-regular-400';
//         font-weight: 400;
//       }
//  
//     application.js
//       export function onLoaded(args){
//         let page=args.object
//         let root=page.getViewById('root')
//         let selector = new Selector()
//         selctor.init()
//         root.addChild(selector)
//         selector.view='AnoterFrameID' //
//         selector.labels='Im a Label, I'm going to be a fontAwsome Icon'  
//         BindRichText(selector.label[1], 'fas:\uf03a', ' Another Label> //will be added in front of Icon'
//       }
//
///////////////////////////////////////////////////////////////////////////////
