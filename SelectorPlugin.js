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
//         BindRichText(selector.label[1], 'fas:\uf03a', ' Another Label> //will be added in front of Icon')
//       }
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
    valueChanged: function(target, oldValue, newValue) { 
      target.notifyPropertyChange('view', newValue, oldValue)
    }
  })

  // the Selector's border color
  #borderColor = new Property({
    name: "borderColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      if(target.selected){
        if(target.selectedBox){
          target.borderWidth=target.selectedWidth
          target.borderTopColor=target.selectedColor
          target.borderRightColor=target.selectedColor
          target.borderBottomColor=target.selectedColor
          target.borderLeftColor=target.selectedColor
        }
        else{
          target.borderWidth=target.unSelectedWidth
          target.borderTopColor=newValue
          target.borderRightColor=newValue
          target.borderBottomWidth=target.selectedWidth
          target.borderBottomColor=target.selectedColor
          target.borderLeftColor=newValue
        }
      }
      else{
        target.borderWidth=target.unSelectedWidth
        target.borderTopColor=newValue
        target.borderRightColor=newValue
        target.borderBottomColor=newValue
        target.borderLeftColor=newValue
      }
      target.notifyPropertyChange('borderColor', newValue, oldValue)
    }
  })

  // if Selector is tapped then selected becomes true
  #selected = new Property({
    name: "selected",
    defaultValue: false,
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      let color=target.borderColor
      target.borderColor=''
      target.borderColor=color
      target.notifyPropertyChange('selected', newValue, oldValue)
    }
  })

  // if this is set to true then the selector outlines the Entire
  // Selector else just the bottom shows the selector
  #selectedBox = new Property({
    name: "selectedBox",
    defaultValue: false,
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      let color=target.borderColor
      target.borderColor=''
      target.borderColor=color
      target.notifyPropertyChange('selectedBox', newValue, oldValue)
    }
  })

  // the color of the selector
  #selectedColor = new Property({
    name: "selectedColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      let color=target.borderColor
      target.borderColor=''
      target.borderColor=color
      target.notifyPropertyChange('selectedColor', newValue, oldValue)
    }
  })

  // use this instead of borderWidth to set the size of the border
  #unSelectedWidth = new Property({
    name: "unSelectedWidth",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      let color=target.borderColor
      target.borderColor=''
      target.borderColor=color
      target.notifyPropertyChange('unSelectedWidth', newValue, oldValue)
    }
  })

  // this set she selectors width.
  #selectedWidth = new Property({
    name: "selectedWidth",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      let color=target.borderColor
      target.borderColor=''
      target.borderColor=color
      target.notifyPropertyChange('selectedWidth', newValue, oldValue)
    }
  })

  // set the horizontal alignment of the labels
  #hAlignment = new Property({
    name: "hAlignment",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      target.horizontalAlignment=newValue
      target.label.map((e,i,o)=>{ e.horizontalAlignment=newValue }) 
      target.notifyPropertyChange('hAlignment', newValue, oldValue)
    }
  })
  
  // set the vertical alignment of the labels
  #vAlignment = new Property({
    name: "vAlignment",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      target.verticalAlignment=newValue
      target.label.map((e,i,o)=>{ e.verticalAlignment=newValue }) 
      target.notifyPropertyChange('vAlignment', newValue, oldValue)
    }
  })

  // sets the Selectors color
  #color = new Property({
    name: "color",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      target.backgroundColor=newValue 
      target.notifyPropertyChange('color', newValue, oldValue)
    }
  })

  // determine how to split the labels string into labels. Default ","
  #spliter = new Property({
    name: "spliter",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      let labels=target.labels; 
      target.labels=''; 
      target.labels=labels 
      target.notifyPropertyChange('spliter', newValue, oldValue)
    }
  })

  // sets labels fontSize
  #fontSize = new Property({
    name: "fontSize",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      target.label.map((e,i,o)=>{ e.fontSize=target.fontSize }) 
      target.notifyPropertyChange('fontSize', newValue, oldValue)
    }
  })

  // sets labels text color
 #textColor = new Property({
    name: "textColor",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      target.label.map((e,i,o)=>{ e.color=target.textColor }) 
      target.notifyPropertyChange('textColor', newValue, oldValue)
    }
  })
  
  // set as many labels as split into a string by spliter.
  #labels = new Property({
    name: "labels",
    defaultValue: '',
    affectsLayout: true,
    valueChanged: function(target, oldValue, newValue) { 
      if(target.getChildrenCount() > 0){ while(target.label.length>0) target.removeChild(target.label.pop()) }
      let lb=newValue.split(target.spliter); lb.map((e,i,o)=>{o[i]=o[i].trim()})
      lb.map((e,i,o)=>{
        let label=new Label()
        label.verticalAlignment=target.vAlignment
        label.horizontalAlignment=target.hAlignment
        label.text=e
        label.fontSize=target.fontSize
        label.color=target.textColor
        target.addChild(label)
//        target.BindRichText(label, e)
      })
      target.notifyPropertyChange('labels', newValue, oldValue)
    }
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
    
    this.on('tap',(o)=>{
      //console.log(o)
      if(this.selected==false){
        this.selected=true
        this.Show(this._view)
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
    let view=this.topLevel.getViewById(this.view)
    this._view=view
    if(this._view){
      this.Hide(this._view)
      if(this.selected==true){
        this.selected=false
        this.selected=true
      }
    }  
  }
}

