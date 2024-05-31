import { api, LightningElement } from 'lwc';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';


export default class directNavigationHeader extends LightningElement {
  
  @api targetStringCollection;
  @api targetStringCSV;
  @api selectedTarget;
  @api selectedSurveyTab;


  connectedCallback() {
      console.log('entering connectedCallback');

      if((this.targetStringCSV != null) && (this.targetStringCollection != null)) {
          console.log('error situation');
          alert("You can\'t provide both a CSV string and a string collection");
          //throw new Error("You can\'t provide both a CSV string and a string collection");
      }

      //build visible statuses out of the targetStringCollection
      let _visibleStatuses = [];
      if (this.targetStringCSV != null) {
        console.log('this.targetStringCSV is: ' + this.targetStringCSV);
        this.targetStringCollection = this.targetStringCSV.split(',');
      }
      console.log('this.targetStringCollection = ' + this.targetStringCollection);

      for(let index = 0; index < this.targetStringCollection.length; index++) {
        let aTab = {}
        aTab["label"] = this.targetStringCollection[index];
        console.log('target is:' + JSON.stringify(aTab));
        _visibleStatuses.push(aTab);

      }
      this.visibleStatuses = _visibleStatuses;
      
  }

  renderedCallback() {
    // Have to do this for a strange error where the first tab stays selected in addition to the active tab
    if(this.template.querySelector("lightning-tabset")) {
      setTimeout(()=>this.template.querySelector("lightning-tabset").focus());
    }
  }
  
  handleActive(event) {
    if(event.target.value == this.selectedSurveyTab) {
      return;
    }

    const attributeChangeEvent = new FlowAttributeChangeEvent('selectedTarget',event.target.value );
    this.dispatchEvent(attributeChangeEvent);
    try
    {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
    catch(e)
    {
      console.error('error: ' , e);
    }
  }
  
}