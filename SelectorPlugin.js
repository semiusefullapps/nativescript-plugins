///////////////////////////////////////////////////////////////////////////////
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

export class Selector extends StackLayout{
  // the only sure way of getting the toplevel view
  get topLevel(){
    let view=this
    while('parent' in view) {view=view.parent}
    return view
  }  

  // set to any id in the page.context
  // when the selector is selected the view pertaining to the id will be visible
  // or invisible if the selector is not selected
  #view = new Property({
    name: "view",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('view', newValue, oldValue) }
  })

  // the Selector's border color
  #borderColor = new Property({
    name: "borderColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('borderColor', newValue, oldValue) }
  })

  // if Selector is tapped then selected becomes true
  #selected = new Property({
    name: "selected",
    defaultValue: false,
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('selected', newValue, oldValue) }
  })

  // if this is set to true then the selector outlines the Entire
  // Selector else just the bottom shows the selector
  #selectedBox = new Property({
    name: "selectedBox",
    defaultValue: false,
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('selectedBox', newValue, oldValue) }
  })

  // the color of the selector
  #selectedColor = new Property({
    name: "selectedColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('selectedColor', newValue, oldValue) }
  })

  // use this instead of borderWidth to set the size of the border
  #unSelectedWidth = new Property({
    name: "unSelectedWidth",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('unSelectedWidth', newValue, oldValue) }
  })

  // this set she selectors width.
  #selectedWidth = new Property({
    name: "selectedWidth",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      let color=target.borderColor; target.notifyPropertyChange('selectedWidth', newValue, oldValue) }
  })

  // set the horizontal alignment of the labels
  #hAlignment = new Property({
    name: "hAlignment",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('hAlignment', newValue, oldValue) }
  })
  
  // set the vertical alignment of the labels
  #vAlignment = new Property({
    name: "vAlignment",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('vAlignment', newValue, oldValue) }
  })

  // sets the Selectors color
  #color = new Property({
    name: "color",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('color', newValue, oldValue) }
  })

  // determine how to split the labels string into labels. Default ","
  #spliter = new Property({
    name: "spliter",
    defaultValue: ',',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('spliter', newValue, oldValue) }
  })

  // sets labels fontSize
  #fontSize = new Property({
    name: "fontSize",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('fontSize', newValue, oldValue) }
  })

  // sets labels text color
 #textColor = new Property({
    name: "textColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      target.notifyPropertyChange('textColor', newValue, oldValue)
    }
  })
  
  // set as many labels as split into a string by spliter.
  #labels = new Property({
    name: "labels",
    defaultValue: 'labels',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { target.notifyPropertyChange('labels', newValue, oldValue) }
  })
  
  constructor(
    labels='Label', spliter=',', width='100%', height='100%', textColor='white', 
    fontSize='18', backgroundColor='black', unSelectedWidth='1', selectedWidth='3',
    borderColor='yellow', selectedColor='red', vAlignment='center', hAlignment='center', 
    selectorBox=false, selected=false){

    super()
    this.#view.register(Selector)
    this.#borderColor.register(Selector)
    this.#selected.register(Selector)
    this.#selectedBox.register(Selector)
    this.#selectedColor.register(Selector)
    this.#unSelectedWidth.register(Selector)
    this.#selectedWidth.register(Selector)
    this.#hAlignment.register(Selector)
    this.#vAlignment.register(Selector)
    this.#color.register(Selector)
    this.#spliter.register(Selector)
    this.#fontSize.register(Selector)
    this.#textColor.register(Selector)
    this.#labels.register(Selector)

    this.fonts={}
    this.fonts['far:']='far' 
    this.fonts['fas:']='fas'
    this.fonts['fab:']='fab'
    this.font=this.fa
  
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
    this.selectedColor=selectedColor
    this.borderColor=borderColor
  
    this.on(Selector.propertyChangeEvent, (target)=>{
      
      if(target.propertyName =='labels') {
        if(target.object.getChildrenCount() > 0){ while(target.object.label.length>0) target.object.removeChild(target.object.label.pop()) }
        let lb=target.value.split(target.object.spliter); lb.map((e,i,o)=>{o[i]=o[i].trim()})
        lb.map((e,i,o)=>{
          let label=new Label()
          label.verticalAlignment=target.object.vAlignment
          label.horizontalAlignment=target.object.hAlignment
          label.text=e
          label.fontSize=target.object.fontSize
          label.color=target.object.textColor
          target.object.addChild(label)
        })
        
        console.log(target.propertyName)
      }

      if(target.propertyName =='textColor') { target.object.label.map((e,i,o)=>{ e.color=target.object.textColor }) }

      if(target.propertyName =='fontSize') { target.label.map((e,i,o)=>{ e.fontSize=target.fontSize }) }

      if(target.propertyName =='spliter') { let labels=target.object.labels; target.object.labels=''; target.object.labels=labels } 

      if(target.propertyName =='color') { target.object.backgroundColor=target.value } 
      
      if(target.propertyName =='vAlignment') { target.object.verticalAlignment=target.value; target.object.label.map((e,i,o)=>{ e.verticalAlignment=target.value }) }

      if(target.propertyName =='hAlignment') { target.object.horizontalAlignment=target.value; target.object.label.map((e,i,o)=>{ e.horizontalAlignment=target.value }) }

      if(target.propertyName =='selectedWidth') { let color=target.object.borderColor; target.object.borderColor=''; target.object.borderColor=color }

      if(target.propertyName =='unSelectedWidth') { let color=target.object.borderColor; target.object.borderColor=''; target.object.borderColor=color }

      if(target.propertyName =='selectedColor') { let color=target.object.borderColor; target.object.borderColor=''; target.object.borderColor=color }

      if(target.propertyName =='selectedBox') { let color=target.object.borderColor; target.object.borderColor=''; target.object.borderColor=color }

      if(target.propertyName =='selected') {
        let color=target.object.borderColor
        target.object.borderColor=''
        target.object.borderColor=color
        console.log(`target.borderColor=Color`)
      }

      if(target.propertyName =='borderColor') {
        if(target.object.selected){
          if(target.object.selectedBox){
            target.object.borderWidth=target.object.selectedWidth
            target.object.borderTopColor=target.object.selectedColor
            target.object.borderRightColor=target.object.selectedColor
            target.object.borderBottomColor=target.object.selectedColor
            target.object.borderLeftColor=target.object.selectedColor
          }
          else{
            target.object.borderWidth=target.object.unSelectedWidth
            target.object.borderTopColor=target.value
            target.object.borderRightColor=target.value
            target.object.borderBottomWidth=target.object.selectedWidth
            target.object.borderBottomColor=target.object.selectedColor
            target.object.borderLeftColor=target.value
          }
        }
        else{
          target.object.borderWidth=target.object.unSelectedWidth
          target.object.borderTopColor=target.value
          target.object.borderRightColor=target.value
          target.object.borderBottomColor=target.value
          target.object.borderLeftColor=target.value
        }
      }

    })

    this.on('tap',(o)=>{
      console.log(this.selected)
      console.log(this.selectedColor)
      if(this.selected==false){
        this.selected=true
        if(this._view) this.Show(this._view)
      }
    })
  }

  get view() { return this._getValue(this.#view) }
  set view(value) { this._setValue(this.#view, value) }

  get borderColor() { return this._getValue(this.#borderColor) }
  set borderColor(value) { this._setValue(this.#borderColor, value) }

  get selected() { return this._getValue(this.#selected) }
  set selected(value) { this._setValue(this.#selected, value) }

  get selectedBox() { return this._getValue(this.#selectedBox) }
  set selectedBox(value) { this._setValue(this.#selectedBox, value) }

  get selectedColor() { return this._getValue(this.#selectedColor) }
  set selectedColor(value) { this._setValue(this.#selectedColor, value) }

  get unSelectedWidth() { return this._getValue(this.#unSelectedWidth) }
  set unSelectedWidth(value) { this._setValue(this.#unSelectedWidth, value) }

  get selectedWidth() { return this._getValue(this.#selectedWidth) }
  set selectedWidth(value) { this._setValue(this.#selectedWidth, value) }

  get hAlignment() { return this._getValue(this.#hAlignment) }
  set hAlignment(value) { this._setValue(this.#hAlignment, value) }

  get vAlignment() { return this._getValue(this.#vAlignment) }
  set vAlignment(value) { this._setValue(this.#vAlignment, value) }

  get color() { return this._getValue(this.#color) }
  set color(value) { this._setValue(this.#color, value) }

  get spliter() { return this._getValue(this.#spliter) }
  set spliter(value) { this._setValue(this.#spliter, value) }

  get fontSize() { return this._getValue(this.#fontSize) }
  set fontSize(value) { this._setValue(this.#fontSize, value) }

  get textColor() { return this._getValue(this.#textColor) }
  set textColor(value) { this._setValue(this.#textColor, value) }
  
  get labels() { return this._getValue(this.#labels) }
  set labels(value) { this._setValue(this.#labels, value) }

  get label(){ let subview=[]; for(let i=0;i < this.getChildrenCount();i++) subview.push(this.getChildAt(i)); return subview }

  get fa(){ this.font=this.fonts['far:']; return this.font}
  get fas() { this.font=this.fonts.fas['fas:']; return this.font }
  get fab() { this.font=this.fonts.fab['fab:']; return this.font }

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

  // Utility functions
  Gone(view){ view.visibility="collapsed" }
  Show(view){ view.visibility="visible" }
  Hide(view){ view.visibility="hidden" }

  // call this once after all is loaded so Selector can
  // find its attached view.id
  init(){
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
}


export class ViewSelector extends StackLayout{
  get topLevel(){
    let view=this
    while('parent' in view) {view=view.parent}
    return view
  }  
/*
  #borderColor = new Property({
    name: "borderColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ e.borderColor=newValue })
      target.notifyPropertyChange('borderColor', newValue, oldValue)
    }
  })


  #selected = new Property({
    name: "selected",
    defaultValue: false,
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      console.log('tapped that')
      target.notifyPropertyChange('selected', newValue, oldValue)
    }
  })

  #selectorBox = new Property({
    name: "selectorBox",
    defaultValue: false,
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ e.selectedBox=newValue })
      target.notifyPropertyChange('selectedBox', newValue, oldValue)
    }
  })

  #selectorColor = new Property({
    name: "selectorColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ e.selectedColor=newValue })
      target.notifyPropertyChange('selectedColor', newValue, oldValue)
    }
  })

  #borderWidth = new Property({
    name: "borderWidth",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
 //     target.selector.map((e,i,o),()=>{ e.unSelectedWidth=newValue })
      target.notifyPropertyChange('unSelectedWidth', newValue, oldValue)
    }
  })

  #selectorWidth = new Property({
    name: "selectorWidth",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ e.selectedWidth=newValue })
      target.notifyPropertyChange('selectedWidth', newValue, oldValue)
    }
  })

  #hAlignment = new Property({
    name: "hAlignment",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ 
//        e.horizontalAlignment=newValue  
//        e.label.map((ee,ii,oo)=>{ ee.horizontalAlignment=newValue }) 
//      })
      target.notifyPropertyChange('hAlignment', newValue, oldValue)
    }
  })
  
  #vAlignment = new Property({
    name: "vAlignment",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ 
//        e.verticalAlignment=newValue  
//        e.label.map((ee,ii,oo)=>{ ee.verticalAlignment=newValue }) 
//      })
      target.notifyPropertyChange('vAlignment', newValue, oldValue)
    }
  })

  #color = new Property({
    name: "color",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ e.color=newValue })
      target.notifyPropertyChange('color', newValue, oldValue)
    }
  })

  
  #spliter = new Property({
    name: "spliter",
    defaultValue: ',',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
  //    let views=target.views 
  //    target.views=''
  //    target.views=views 
      target.notifyPropertyChange('spliter', newValue, oldValue)
    }
  })


  #fontSize = new Property({
    name: "fontSize",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ e.label.map((ee,ii,oo)=>{ ee.fontSize=newValue }) })
      target.notifyPropertyChange('fontSize', newValue, oldValue)
    }
  })

  
  #textColor = new Property({
    name: "textColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
//      target.selector.map((e,i,o),()=>{ e.label.map((ee,ii,oo)=>{ ee.color=newValue }) })
      target.notifyPropertyChange('textColor', newValue, oldValue)
    }
  })
*/
  #views = new Property({
    name: "views",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      if(target.getChildrenCount() > 0){ while(target.label.length>0) target.removeChild(target.label.pop()) }
      let vs=newValue.split(target.spliter); vs.map((e,i,o)=>{o[i]=o[i].trim()})
      vs.map((e,i,o)=>{
        let selector=new Selector()
        
        target.verticalAlignment=selector.vAlignment
        target.horizontalAlignment=selector.hAlignment
//        selector.fontSize=target.fontSize
//        selector.color=target.textColor
        selector.view=e
//        selector.spliter=','
        selector.labels='label'
        target.addChild(selector)
      })
      target.notifyPropertyChange('views', newValue, oldValue)
    }
  })
 
  constructor(
    views='viewID', spliter=',', width='100%', height='100%', textColor='white', 
    fontSize='18', backgroundColor='black', borderWidth='1', selectorWidth='3',
    borderColor='yellow', selectorColor='red', vAlignment='center', hAlignment='center', 
    selectorBox=false, selected=false){

    super()
    
    this.#views.register(ViewSelector)
//    this.#borderColor.register(ViewSelector)
//    this.#selected.register(ViewSelector)
//    this.#selectorBox.register(ViewSelector)
//    this.#selectorColor.register(ViewSelector)
//    this.#borderWidth.register(ViewSelector)
//    this.#selectorWidth.register(ViewSelector)
//    this.#hAlignment.register(ViewSelector)
//    this.#vAlignment.register(ViewSelector)
//    this.#color.register(ViewSelector)
//    this.#spliter.register(ViewSelector)
//    this.#fontSize.register(ViewSelector)
//    this.#textColor.register(ViewSelector)

    this.fonts={}
    this.fonts['far:']='far' 
    this.fonts['fas:']='fas'
    this.fonts['fab:']='fab'
    this.font=this.fa
  
    this.width=width
    this.height=height
    this.views=views
    //this.spliter=spliter
//    this.textColor=textColor
//    this.color=backgroundColor
//    this.fontSize=fontSize
//    this.vAlignment=vAlignment
//    this.hAlignment=hAlignment
//    this.borderWidth=borderWidth
//    this.selectorWidth=selectorWidth
//    this.selectorColor=selectorColor
//    this.borderColor=borderColor

    this.on(Selector.propertyChangeEvent, (o)=>{``
      console.log(o.propertyName)
      if(o.propertyName =='labels') console.log('labels changed.')
    })

    this.on('tap',(o)=>{
      console.log('pii')
      console.log(this.selector[0].selectedColor)
      if(this.selected==false){
        this.selected=true
        if(this._view) this.Show(this._view)
      }
    })
 
    /*
    this.on('tap',(o)=>{
      //console.log(o)
      if(this.selected==false){
        this.selected=true
        //this.Show(this._view)
        console.log(this.views)
      }
    })
*/
  }
  
  get views() { return this._getValue(this.#views) }
  set views(value) { this._setValue(this.#views, value) }

  get selector(){ let subview=[]; for(let i=0;i < this.getChildrenCount();i++) subview.push(this.getChildAt(i)); return subview }
/*
//  get borderColor() { return this._getValue(this.#borderColor) }
//  set borderColor(value) { this._setValue(this.#borderColor, value) }

  get selected() { return this._getValue(this.#selected) }
  set selected(value) { this._setValue(this.#selected, value) }

  get selectorBox() { return this._getValue(this.#selectorBox) }
  set selectorBox(value) { this._setValue(this.#selectorBox, value) }

  get selectorColor() { return this._getValue(this.#selectorColor) }
  set selectorColor(value) { this._setValue(this.#selectorColor, value) }

  get borderWidth() { return this._getValue(this.#borderWidth) }
  set borderWidth(value) { this._setValue(this.#borderWidth, value) }

  get selectorWidth() { return this._getValue(this.#selectorWidth) }
  set selectorWidth(value) { this._setValue(this.#selectorWidth, value) }

  get hAlignment() { return this._getValue(this.#hAlignment) }
  set hAlignment(value) { this._setValue(this.#hAlignment, value) }

  get vAlignment() { return this._getValue(this.#vAlignment) }
  set vAlignment(value) { this._setValue(this.#vAlignment, value) }

  get color() { return this._getValue(this.#color) }
  set color(value) { this._setValue(this.#color, value) }

 // get spliter() { return this._getValue(this.#spliter) }
//  set spliter(value) { this._setValue(this.#spliter, value) }

  get fontSize() { return this._getValue(this.#fontSize) }
  set fontSize(value) { this._setValue(this.#fontSize, value) }

  get textColor() { return this._getValue(this.#textColor) }
  set textColor(value) { this._setValue(this.#textColor, value) }
*/
  get fa(){ this.font=this.fonts['far:']; return this.font}
  get fas() { this.font=this.fonts.fas['fas:']; return this.font }
  get fab() { this.font=this.fonts.fab['fab:']; return this.font }

  // use this to set font-awsome icons to the labels
  BindRichText(view, ...strings){   
    function _MakeRichText( ...string ){
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
  
    let span=[]
    let formated=this._MakeRichText(...strings)     
    view.formattedText=formated
    return view    
  }

  // Utility functions
  Gone(view){ view.visibility="collapsed" }
  Show(view){ view.visibility="visible" }
  Hide(view){ view.visibility="hidden" }

  // call this once after all is loaded so Selector can
  // find its attached view.id
  init(){
    this.selector.map((e,i,o)=>{ 
      let view=this.topLevel.getViewById(o[i].view[i]) 
      if(view){
        o[i]._view=view
        this.Hide(o[i]._view)
        if(o[i].selected==true){
          o[i].selected=false
          o[i].selected=true
        }
      }  
    })
  }
}

/*
export class ViewSelector extends StackLayout{
  constructor(){
    super()
    this.id=GenerateCode("ViewSelector.","_ID","",10,1,1,true,true,false,false)
    this.frame=[]
    this.width="100%"  
    this.height="100%"
    this.orientation='horizontal'
    this.verticalAlignment='center'
    this.horizontalAlignment='center'
    this.textAlignment='center'
    this._selected=0
    this._selectedColor='green'
    this._selectorColor=this.backgroundColor
    this._selectorWidth=3
    this._borderColor=this.backgroundColor
    this._borderWidth=this.borderWidth
      

    this._fontSize=16
    this._labels=1
    this.views='happy, day'//GenerateCode(".","_ID","",10,1,1,true,true,false,false)
    this.Build()
//    this.on(StackLayout.loadedEvent, this.onLoaded, this);

    //    this.Build()
//    this.selected=this._selected
  } 
  
//  onLoaded(args){
//    super.onLoaded(args);


//    this.frame.map((e,i,r)=>{
//      e.on(GestureTypes.tap,(event)=>{ 
//        console.log(this.view)            
//      })
//    })
  
//  }

/*
  get viewer(){ return this._viewer }
  set viewer(view_id){ 
    let page=Frame.topmost().currentPage
    let ids=view_id.split(",")
    for(let i in ids) {
      ids[i]=ids[i].trim()  
      this._viewer[i]=page.getViewById(ids[i])
    }
  }
*/

/*
  Build(){
    this._Build()
    this.selected=this._selected
  }

  _Build(){
    
    let ui=MakeUI()
    if(this.frame.length>0) while(this.frame.length>0) ui.Destroy(this.frame.pop())

    let height=`${this.height.value*100}%`
    let width=`${this.width.value*100}%`
    let views=this.views
    
    if (this.orientation=='horizontal') width=`${this.width.value/views.length*100}%`
    if (this.orientation=='vertical') height=`${this.height.value/views.length*100}%`

    let borderWidth=this.borderWidth
    let borderColor=this.borderColor
    let selectorColor = this.selectorColor
    let selectorWidth = this.selectorWidth
    views.map((e,i,v)=>{
      this.frame.push(ui.MakeStackLayout(this,'vertical',width,height,'', borderWidth, borderColor))
//      this.frame[i].borderBottomColor=selectorColor
//      this.frame[i].borderBottomWidth=selectorWidth      
      this.frame[i].id=e
      this.frame[i].horizontalAlignment=this.horizontalAlignment
      this.frame[i].verticalAlignment=this.verticalAlignment
      this.frame[i].label=[]
            
      this.frame[i].on(GestureTypes.tap,(event)=>{ 
        if(views[this.selected]==e) {}
        else {
//          this.frame[this.selected].borderBottomColor=this.selectorColor
//          this._selected=vn
//          this.frame[this.selected].borderBottomColor=this.selectedColor
      
//          let ui=MakeUI()
//          ui.Gone(this._viewer[this.selected])
//          this.selected=i
//          ui.Show(this._viewer[this.selected])
        }  
      })

//      this.frame[i].on('loaded',(event)=>{
//        console.log(Object.keys(event))
//        console.log(event.eventName)
//      })

      for(let j=0; j<this.labels; j++) {
        let label=ui.MakeLabel(this.frame[i],`${i}-${j}`)
        this.frame[i].label.push(label)
        let lbl=this.Label(i,j)
//        lbl.color=this.color
//        lbl.fontSize=this.fontSize
        lbl.textAlignment=this.textAlignment
        lbl.id=`${e}.${i}.${j}_ID`
      } 
    })
  }

  Label(pos, num){ return this.frame[pos].label[num] }

//  get selectorColor(){ return this.frame[this.selected].borderBottomColor }
//  set selectorColor(color){ this.frame[this.selected].borderBottomColor=this.color }
  
//  get selectedColor(){ return this.frame[this.selected].borderBottomColor }
//  set selectedColor(color){ this.frame[this.selected].borderBottomColor=color }

//  get selectorWidth(){ return this.frame[i].borderBottomWidth }
//  set selectorWidth(width){ this.frame[i].borderBottomWidth=width}

//  get borderColor(){ return this.frame[i].borderColor }
//  set borderColor(color){ this.frame[i].borderColor=color }

//  get borderWidth(){ return this.frame[i].borderWidth }
//  set borderWidth(width){ this.frame[i].borderWidth=width }

  get labels(){ return this._labels }
  set labels(number){ this._labels=number }  
  
  get view(){
    return this.views[this.selected]
  }

  get views() {
    let views=this._views.split(",")
    for(let i in views) views[i]=views[i].trim()  
    return views
   }

  set views(names) { 
    this._views=names
  }

//  get fontSize(){return this._fontSize }
//  set fontSize(size){ this._fontSize=size; return this.fontSize }    

/*
  get color(){ 
    //super().this.color
    console.log('got color') 
    return this.color
  }

  set color(color){ 
    //super().this.color
    this.color=color 
    console.log('set color')
  }
*/

//  get selected(){ return this._selected; }
//  set selected(vn) { 

    //    this.frame[this.selected].borderBottomColor=this.selectorColor
//    this._selected=vn
//    this.frame[this.selected].borderBottomColor=this.selectedColor
  //}

  /*
  setupViewer(context, self){
    let vs=self
    let ui=MakeUI()
    vs._viewer={...vs.views}
    for(let i in vs._viewer){ 
      vs._viewer[i]=context.getViewById(vs._viewer[i])
      ui.Gone(vs._viewer[i])
    }
    ui.Show(vs._viewer[vs.selected])
  }
  
}

/*
export function ViewSelector(){ 
  let view = new cViewSelector();
    
  


  //  view.orientation='horizontal';
/*
  view.frame.map((e,i,r)=>{
    e.on(GestureTypes.tap,(event)=>{ 
      console.log(view.id)
    })
  })
  
  return view 
}
*/
