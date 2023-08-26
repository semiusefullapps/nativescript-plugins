import { StackLayout, Label, GestureTypes, FormattedString, Span } from "@nativescript/core"

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

// updated Stacklayout with some utility functions
class VSSL extends StackLayout{
  constructor(){
    super()
    // make sure these match your css fontAwsome definitions as shown above
    this.fonts={}
    this.fonts['far:']='far' 
    this.fonts['fas:']='fas'
    this.fonts['fab:']='fab'
    this.font=this.fa
  }

  get fa(){ this.font=this.fonts['far:']; return this.font}
  get fas() { this.font=this.fonts.fas['fas:']; return this.font }
  get fab() { this.font=this.fonts.fab['fab:']; return this.font }

  // the only sure way of getting the toplevel view
  get topLevel(){
    let view=this
    while('parent' in view) {view=view.parent}
    return view
  }  

  //setup for richtext in arguments
  _MakeRichText( ...string ){
    let span=[]
    let formated= new FormattedString()
    for (let i in string){ 
      span.push( new Span() )
      span[i].text=string[i]
      span[i].className=this.font
      for (let j in this.fonts )  
        if(string[i].startsWith(j)){
          span[i].text=string[i].slice(4)
          span[i].className=this.fonts[j]
        }      
      formated.spans.push(span[i])
    }
    return formated
  }

  // use this to set font-awsome icons to the labels
  BindRichText(view, ...strings){     
    let span=[]
    let formated=this._MakeRichText(...strings)     
    view.formattedText=formated
    return view    
  }

  // can be helpfull
  Gone(view){ view.visibility="collapsed" }
  Show(view){ view.visibility="visible" }
  Hide(view){ view.visibility="hidden" }

}

class Selector extends VSSL{

  #view = undefined
  #borderColor = undefined
  #selected = undefined
  #selectedBox = undefined 
  #selectedColor = undefined
  #unSelectedWidth = undefined
  #selectedWidth = undefined
  #hAlignment = undefined
  #vAlignment = undefined
  #color = undefined
  #spliter = undefined
  #fontSize = undefined
  #textColor = undefined
  
  // set as many labels as split into a string by spliter.
  #labels = ''
  
  constructor(
    labels='Label', spliter=',', width='100%', height='100%', textColor='white', 
    fontSize='18', backgroundColor='black', unSelectedWidth='1', selectedWidth='3',
    borderColor='yellow', selectedColor='red', vAlignment='center', hAlignment='center', 
    selectorBox=false, selected=false, view=''){

    super()
 
    this.on(Selector.propertyChangeEvent, (target)=>{
      let v=target.value
      let ov=target.oldValue
      let obj=target.object
      let pn=target.propertyName

      if(target.propertyName =='labels') {
        if(obj.getChildrenCount() > 0){ while(obj.label.length>0) obj.removeChild(obj.label.pop()) }
        let lb=v.split(obj.spliter); lb.map((e,i,o)=>{o[i]=o[i].trim()})
        lb.map((e,i,o)=>{
          let label=new Label()
          label.verticalAlignment=obj.vAlignment
          label.horizontalAlignment=obj.hAlignment
          label.text=e
          label.fontSize=obj.fontSize
          label.color=obj.textColor
          obj.addChild(label)
        })
      }

      if(pn =='textColor') { obj.label.map((e,i,o)=>{ e.color=obj.textColor }) }

      if(pn =='fontSize') { obj.label.map((e,i,o)=>{ e.fontSize=obj.fontSize }) }

      if(pn =='spliter') { let labels=obj.labels; obj.labels=''; obj.labels=labels } 

      if(pn =='color') { obj.backgroundColor=v } 
      
      if(pn =='vAlignment') { obj.verticalAlignment=v; obj.label.map((e,i,o)=>{ e.verticalAlignment=v }) }

      if(pn =='hAlignment') { obj.horizontalAlignment=v; obj.label.map((e,i,o)=>{ e.horizontalAlignment=v }) }
                                                 
      if(pn =='selectedWidth') { let color=obj.borderColor; obj.borderColor=''; obj.borderColor=color }

      if(pn =='unSelectedWidth') { let color=obj.borderColor; obj.borderColor=''; obj.borderColor=color }

      if(pn =='selectedColor') { let color=obj.borderColor; obj.borderColor=''; obj.borderColor=color }

      if(pn =='selectedBox') { let color=obj.borderColor; obj.borderColor=''; obj.borderColor=color }

      if(pn =='selected') { 
        let color=obj.borderColor; obj.borderColor=''; obj.borderColor=color 
        
        if(obj._view){
          if(obj.selected) obj.Show(obj._view)
          else obj.Hide(obj._view)
        }

      }

      if(pn =='borderColor') {
        if(obj.selected){
          if(obj.selectedBox){
            obj.borderWidth=obj.selectedWidth
            obj.borderTopColor=obj.selectedColor
            obj.borderRightColor=obj.selectedColor
            obj.borderBottomColor=obj.selectedColor
            obj.borderLeftColor=obj.selectedColor
          }
          else{
            obj.borderWidth=obj.unSelectedWidth
            obj.borderTopColor=v
            obj.borderRightColor=v
            obj.borderBottomWidth=obj.selectedWidth
            obj.borderBottomColor=obj.selectedColor
            obj.borderLeftColor=v
          }
        }
        else{
          obj.borderWidth=obj.unSelectedWidth
          obj.borderTopColor=v
          obj.borderRightColor=v
          obj.borderBottomColor=v
          obj.borderLeftColor=v
        }
      }

      if(pn =='view') { 
        let view=this.topLevel.getViewById(this.view)
        if(view){
          this._view=view
          this.Hide(this._view)
        }              
      }

    })

    this.on(GestureTypes.touch,(o)=>{
      let obj=o.object
      if(obj.selected==false){ 
        obj.selected=true 
        obj.parent.selected=obj.view
        obj.parent.Select(obj.view)
      }

    })
    
    this.width=width
    this.height=height
    this.labels=labels
    this.spliter=spliter
    this.textColor=textColor
    this.color=backgroundColor
    this.fontSize=fontSize
    this.vAlignment=vAlignment
    this.hAlignment=hAlignment
    this.unSelectedWidth=unSelectedWidth
    this.selectedWidth=selectedWidth
    this.view=''
    this.selectedColor=selectedColor
    this.borderColor=borderColor
    this.selected=selected
    this.view=view    
  }

  onLoaded(){
    super.onLoaded();
    
    let view=this.topLevel.getViewById(this.view)
    if(view){
      this._view=view
      this.Hide(this._view)
      if(this.selected==true){
        this.selected=false
        this.selected=true
      }
    }  
  }

  get view() { return this.#view }
  set view(value) { let ov=this.view; this.#view=value; this.notifyPropertyChange('view', value, ov) }

  get borderColor() { return this.#borderColor }
  set borderColor(value) { let ov=this.view; this.#borderColor=value; this.notifyPropertyChange('borderColor', value, ov) }
  
  get selected() { return this.#selected }
  set selected(value) { let ov=this.selected; this.#selected=value; this.notifyPropertyChange('selected', value, ov) }

  get selectedBox() { return this.#selectedBox }
  set selectedBox(value) { let ov=this.selectedBox; this.#selectedBox=value; this.notifyPropertyChange('selectedBox', value, ov) }

  get selectedColor() { return this.#selectedColor }
  set selectedColor(value) { let ov=this.selectedColor; this.#selectedColor=value; this.notifyPropertyChange('selectedColor', value, ov) }

  get unSelectedWidth() { return this.#unSelectedWidth }
  set unSelectedWidth(value) { let ov=this.unSelectedWidth; this.#unSelectedWidth=value; this.notifyPropertyChange('unSelectedWidth', value, ov) }

  get selectedWidth() { return this.#selectedWidth }
  set selectedWidth(value) { let ov=this.selectedWidth; this.#selectedWidth=value; this.notifyPropertyChange('selectedWidth', value, ov) }

  get hAlignment() { return this.#hAlignment }
  set hAlignment(value) { let ov=this.hAlignment; this.#hAlignment=value; this.notifyPropertyChange('hAlignment', value, ov) } 

  get vAlignment() { return this.#vAlignment }
  set vAlignment(value) { let ov=this.vAlignment; this.#vAlignment=value; this.notifyPropertyChange('vAlignment', value, ov) }

  get color() { return this.#color }
  set color(value) { let ov=this.color; this.#color=value; this.notifyPropertyChange('color', value, ov) }

  get spliter() { return this.#spliter }
  set spliter(value) { let ov=this.spliter; this.#spliter=value; this.notifyPropertyChange('spliter', value, ov) }

  get fontSize() { return this.#fontSize }
  set fontSize(value) { let ov=this.fontSize; this.#fontSize=value; this.notifyPropertyChange('fontSize', value, ov) }

  get textColor() { return this.#textColor }
  set textColor(value) { let ov=this.textColor; this.#textColor=value; this.notifyPropertyChange('textColor', value, ov) }
  
  get labels() { return this.#labels }
  set labels(value) { let ov=this.labels; this.#labels=value; this.notifyPropertyChange('labels', value, ov) }

  get label(){ let subview=[]; for(let i=0;i < this.getChildrenCount();i++) subview.push(this.getChildAt(i)); return subview }  
}

export class ViewSelector extends VSSL{
  get topLevel(){
    let view=this
    while('parent' in view) {view=view.parent}
    return view
  }  

  #borderColor = undefined
  #selected = undefined
  #selectorBox = undefined
  #selectorColor = undefined
  #borderWidth = undefined
  #selectorWidth = undefined
  #hAlignment = undefined
  #vAlignment = undefined
  #color = undefined
  #spliter = undefined
  #fontSize = undefined
  #textColor = undefined
  #views = undefined
   
  constructor(
    views='', spliter=',', width='100%', height='100%', textColor='white', 
    fontSize='18', backgroundColor='black', borderWidth='1', selectorWidth='3',
    borderColor='yellow', selectorColor='red', vAlignment='center', hAlignment='center', 
    selectorBox=false){
      
    super()
    
    this.on(ViewSelector.propertyChangeEvent, (target)=>{
      let v=target.value
      let ov=target.oldValue
      let obj=target.object
      let pn=target.propertyName

      if(pn =='views') { 
        let height=`${obj.height.value*100}%`
        let width=`${obj.width.value*100}%`
        
        if(obj.getChildrenCount() > 0){ while(obj.selector.length>0) obj.removeChild(obj.selector.pop()) }
        let vs=v.split(obj.spliter); vs.map((e,i,o)=>{o[i]=o[i].trim()})

        if (obj.orientation=='horizontal')  width=`${obj.width.value/vs.length*100}%` 
        if (obj.orientation=='vertical')  height=`${obj.height.value/vs.length*100}%`

        vs.map((e,i,o)=>{      
          
          let selector=new Selector(e, obj.spliter, width, height, obj.textColor, obj.fontSize, obj.color,
            obj.borderWidth, obj.selectorWidth, obj.borderColor, obj.selectorColor, obj.vAlignment, obj.hAlignment, 
            obj.selectorBox, false, e)
            
          obj.addChild(selector)
        })  
      }

      if(pn =='textColor'){ obj.selector.map((e,i,o)=>{ e.textColor=v }) }

      if(pn =='fontSize'){ obj.selector.map((e,i,o)=>{ e.fontSize=v }) }
    
      if(pn =='spliter'){ let views=obj.views; obj.views=''; obj.views=views; obj.selector.map((e,i,o)=>{ e.spliter=v }) } 
      
      if(pn =='color'){ obj.selector.map((e,i,o)=>{ e.color=v }) }

      if(pn =='vAlignment'){ obj.verticalAlignment=v; obj.selector.map((e,i,o)=>{ e.vAlignment=v }) }

      if(pn =='hAlignment'){ obj.horizontalAlignment=v; obj.selector.map((e,i,o)=>{ e.hAlignment=v }) }

      if(pn =='selectorWidth'){ obj.selector.map((e,i,o)=>{ e.selectedWidth=v }) }
    
      if(pn =='borderWidth'){ obj.selector.map((e,i,o)=>{ e.unSelectedWidth=v }) }

      if(pn =='selectorColor'){ obj.selector.map((e,i,o)=>{ e.selectedColor=v }) }

      if(pn =='selectorBox'){ obj.selector.map((e,i,o)=>{ e.selectedBox=v }) }

      if(pn =='borderColor'){ obj.selector.map((e,i,o)=>{ e.borderColor=v }) }

    })
    
    this.orientation='horizontal'
    this.width=width
    this.height=height
    this.views=views
    this.spliter=spliter
    this.textColor=textColor
    this.color=backgroundColor
    this.fontSize=fontSize
    this.vAlignment=vAlignment
    this.hAlignment=hAlignment
    this.borderWidth=borderWidth
    this.selectorWidth=selectorWidth
    this.selectorColor=selectorColor
    this.borderColor=borderColor
    this.selectorBox=selectorBox

  }

  onLoaded(){
    super.onLoaded()
    this.Select(this.selected)
  }
  get borderColor() { return this.#borderColor }
  set borderColor(value) { let ov=this.#borderColor; this.#borderColor=value; this.notifyPropertyChange('borderColor', value, ov) }

  get selected() { return this.#selected }
  set selected(value) { let ov=this.#selected; this.#selected=value; this.notifyPropertyChange('selected', value, ov) }

  get selectorBox() { return this.#selectorBox }
  set selectorBox(value) { let ov=this.#selectorBox; this.#selectorBox=value; this.notifyPropertyChange('selectorBox', value, ov) }

  get selectorColor() { return this.#selectorColor }
  set selectorColor(value) { let ov=this.#selectorColor; this.#selectorColor=value; this.notifyPropertyChange('selectorColor', value, ov) }

  get borderWidth() { return this.#borderWidth }
  set borderWidth(value) { let ov=this.#borderWidth; this.#borderWidth=value; this.notifyPropertyChange('borderWidth', value, ov) }

  get selectorWidth() { return this.#selectorWidth }
  set selectorWidth(value) { let ov=this.#selectorWidth; this.#selectorWidth=value; this.notifyPropertyChange('selectorWidth', value, ov) }

  get hAlignment() { return this.#hAlignment }
  set hAlignment(value) { let ov=this.#hAlignment; this.#hAlignment=value; this.notifyPropertyChange('hAlignment', value, ov) }

  get vAlignment() { return this.#vAlignment }
  set vAlignment(value) { let ov=this.#vAlignment; this.#vAlignment=value; this.notifyPropertyChange('vAlignment', value, ov) }

  get color() { return this.#color }
  set color(value) { let ov=this.#color; this.#color=value; this.notifyPropertyChange('color', value, ov) }

  get spliter() { return this.#spliter }
  set spliter(value) { let ov=this.#spliter; this.#spliter=value; this.notifyPropertyChange('spliter', value, ov) }

  get fontSize() { return this.#fontSize }
  set fontSize(value) { let ov=this.#fontSize; this.#fontSize=value; this.notifyPropertyChange('fontSize', value, ov) }

  get textColor() { return this.#textColor }
  set textColor(value) { let ov=this.#textColor; this.#textColor=value; this.notifyPropertyChange('textColor', value, ov) }

  get views() { return this.#views }
  set views(value) { let ov=this.#views; this.#views=value; this.notifyPropertyChange('views', value, ov) }

  get selector(){ let subview=[]; for(let i=0;i < this.getChildrenCount();i++) subview.push(this.getChildAt(i)); return subview }

  Select(view){
    this.selector.map((e,i,o)=>{ e.selected=false })
    this.selector.map((e,i,o)=>{ 
      if(e.view==view) { e.selected=true } 
    })
  }

  Horizontal(){ this.orientation='horizontal'; let views=this.views; this.views=''; this.views=views; this.Select(this.selected) }

  Vertical(){ this.orientation='vertical'; let views=this.views; this.views=''; this.views=views; this.Select(this.selected) }

}
