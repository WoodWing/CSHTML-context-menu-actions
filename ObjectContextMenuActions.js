(function(){

/*
   This script will help to convert old-style (CS9 and older) ContentStation ObjectContextMenuActions 
   to CS10 ContextActions
   
   The old defintion for CS9 is located in wwsettings.xml, in the ObjectContextMenuActions section.
   the lines from that section can be converted to this defintion by making some small changes.
   
   a wwsetting line looks like:
   <ObjectContextMenuAction label="printObjectAsHTML" url="{SERVER_URL}config/CS-scripts/printObjectAsHTML.php?ticket={SESSION_ID}&amp;ids={OBJECT_IDS}" objtypes="Layout" displayMode="external"/>
		    
   replace:  '<ObjectContextMenuAction' with '{'
   replace:  ending '/>' with '}'
   replace: the '=' behind each field with a ':'
   add a comma between each field
   replace &amp; with &	
   
   { label:"printObjectAsHTML", url:"{SERVER_URL}config/CS-scripts/printObjectAsHTML.php?ticket={SESSION_ID}&ids={OBJECT_IDS}", objtypes:"Layout" displayMode:"external" }
	

   the actionlist below needs to contain objects with the structure
   { label: '' , url:'', objtypes:'' , displayMode:'', multiSelect : '', subMenu: ''}
   
   where 
   - label -> the text in the actionMenu
   - url   -> the path to the server call. 
   - objtypes -> comma seperated list of objectTypes for which this call is active
   - displayMode -> 'external' open in new window, 
   					'internal' open in same window, 
   					'dialog' open in popup
   					'info'   show simple dialog with close
   					'silent' will not show any result
   					html pages using POST/GET will need to use 'external'
   					html/javascript pages that use ajax can use internal or dialog
   - multiSelect -> if set to false, call will only work for single selection
   - subMenu	 -> if set, this action will be under the specified submenu
   
   placeholders in URL:
   
   - {SERVER_URL}	will be replaced with the serverURL of the Enterprise Server  
   - {SESSION_ID}	will be replaced with the active ticket
   - {OBJECT_IDS}	will be replaced with a comma seperated string of objectIDS
   - {DOSSIER_ID}	will be replaced with the active dossier, only available in dossier context
   
   
 */  

  var actionList = [  	
  					  {	label:	"printObjectAsHTML" ,  
  					  	url:	"{SERVER_URL}config/CS-scripts/printObjectAsHTML.php?ticket={SESSION_ID}&ids={OBJECT_IDS}", 
  					  	objtypes:"Article,Image",
  					  	displayMode:"dialog",
  					  	multiSelect: "false",
  					  	multiSelect: "false",
  					  	subMenu: "Print-sample",
  					  },
  					  { label:	"CreatePDF-Print" ,  
  					  	url:	"{SERVER_URL}config/plugins/sQCreatePDF/index.php?mode=print&ticket={SESSION_ID}&ids={OBJECT_IDS}",
  					  	objtypes:"Layout" , 
  					  	displayMode:"dialog",
  					  	multiSelect: "false",
  					  	subMenu: "CreatePDF",
  					  },
		              { label:	"CreatePDF-Screen",  
		              	url:	"{SERVER_URL}config/plugins/sQCreatePDF/index.php?mode=screen&ticket={SESSION_ID}&ids={OBJECT_IDS}",
		              	objtypes:"Layout", 
		              	displayMode:"external",
		              	multiSelect: "false",
		              	subMenu: "CreatePDF",
		              },
		              { label:	"PortoE:CreateTask routeto woodwing" ,
						url: 	"{SERVER_URL}config/plugins/sQCreateTask/createTask.php?ticket={SESSION_ID}&ids={OBJECT_IDS}&dossierID={DOSSIER_ID}&routeto=woodwing", 
						objtypes:	"Article,Image", 
						displayMode: "silent",
						multiSelect: "false",
					  }	,
					  {
					  	label: 	"Create/Edit Approval Flow",
					  	url:	"{SERVER_URL}config/plugins/sQApprovalFlow/sQCreateApprovalFlow.php?ticket={SESSION_ID}&ids={OBJECT_IDS}",
					  	objtypes:	"Layout,Image",
					  	displayMode: "dialog",
					  	multiSelect: "false",	
					  	subMenu: "Approval",	
		    
					  },
					  {
					  	label:	"Approval Report",
					  	url:	"{SERVER_URL}config/plugins/sQApprovalFlow/sQApprovalFlowReport.php?ticket={SESSION_ID}&ids={OBJECT_IDS}",
					  	objtypes:	"Layout,Image",
					  	displayMode:	"dialog",	
					  	multiSelect: "false",
					  	subMenu: "Approval",	 		
					  }
		    		
		    		];


  // =========================================
  // (basically) no changes below this line
  // =========================================	

  // draw a seperator line
  ContentStationSdk.createAction({
		isLine: true
	  });
	  	
	  	 
  // loop trough the actions and create the menu entries and action events	 
  // 	
  var subMenus = {};
  
  actionList.forEach ( function( call) {
   
      var thisAction = {
        // check if subMenu is specified
		title:  call.label,
		onInit: function(config, selection){
		  // if the objectType does not match the types in actionList objtypes
		  config.isRemoved =  call.objtypes.indexOf(selection[0].Type) == -1;
		  
		  // if we have multiple objects selected and multiSelect is false
		  // disable the menu entry
		  if ( call.multiSelect == "false" ){
		  	config.isDisabled = selection.length > 1 ;
		  }
		},
		onAction: function(selection, dossier ){
		  var executeURL = replaceVariables (selection, dossier, call.url );	
		  
		  switch( call.displayMode ) {
		  	case 'dialog' : 
		  			openInDialog( call.label, executeURL );
		  			break;
		    case 'info' :
		    		showInfo( call.label, executeURL );
		  			break;	
		  	case 'silent'   :	
		  			runSilent( call.label, executeURL );
		  			break;		
		  	case 'external'	:
		  			window.open(executeURL, '_blank');
		  			break;
		  	case 'internal' :
		  			window.open(executeURL, '_self');
		  			break;
		  }
		  
		}
		
	  };
	  
	  // if the subMenu key is there and not empty
	  if ( typeof (call.subMenu ) != 'undefined' &&
	  	   call.subMenu != '' )
	  {
	  	// then add to the list
	    if (typeof( subMenus[ call.subMenu ] ) == 'undefined' ) { subMenus[ call.subMenu ] = []; }
	  	subMenus[ call.subMenu ].push( thisAction ) ; 
	  }
	  else{
		  ContentStationSdk.createAction( thisAction );
	  }	  	
  });
  				  
  				 
  // create the subMenus (if any)
  jQuery.each ( subMenus, 
  				function ( title, subMenu )
  				{
					var subAction = {
					  title: title,
					  onInit: function(config, selection){
							config.submenu = subMenu;
					  }
					}
					ContentStationSdk.createAction(subAction);  
	 			});
  
 
  				  
  
  // draw a seperator line
  ContentStationSdk.createAction({
		isLine: true
  });
	  	
  
  // ----------------------------------------
  // functions only below this line
  // ----------------------------------------
  
  /*
    the URL defined in the actionList can contain placeholders
    - {SERVER_URL}	will be replaced with the serverURL of the Enterprise Server  
  	- {SESSION_ID}	will be replaced with the active ticket
   	- {OBJECT_IDS}	will be replaced with a comma seperated string of objectIDS
   	- {DOSSIER_ID}	will be replaced with the active dossier, only available in dossier context
   */	
  function 	replaceVariables(selection, dossier, url )
  {
  	 // replace {SERVER_URL}
  	 var info = ContentStationSdk.getInfo();
	 var serverURL =  info.ServerInfo.URL.replace('index.php','');
     url = url.replace('{SERVER_URL}',serverURL);
  
	 // replace {SESSION_ID}
  	 url = url.replace('{SESSION_ID}',info.Ticket);
  	 
  	 // replace {DOSSIER_ID}
  	 //url = url.replace('{DOSSIER_ID}',dossier[0].ID );
  
  	 // replace {OBJECT_IDS}
     var objectIDS = '';
     for (i=0;i<selection.length;i++)
     {
     	if ( objectIDS != '') { objectIDS += ','; }
     	objectIDS += selection[i].ID;
     }
  	 url = url.replace('{OBJECT_IDS}', objectIDS);
     return url;
  }
	
	
	
  function openInDialog( label, url ){		
   	 var jqModalContent = $('<iframe frameborder="0" style="margin: 0; padding: 0; height: 500px; width: 100%"></iframe>');
    // Open modal dialog and keep the dialog id
    var dialogId = ContentStationSdk.openModalDialog({
      title: label,
      width: 1000,
      content: jqModalContent.attr('src', url ),
      contentNoPadding: true,
      buttons: [
        // Button defined as secondary with class 'pale'
        // Has no callback defined - will close the dialog.
        {
          label: 'Close',
          class: 'pale'
        },
        // Button defined as normal/primary
        // On click will close the dialog with cached dialog id, and open new tab with iframeSrc url
        {
          label: 'Open in new tab',
          callback: function(){
            ContentStationSdk.closeModalDialog(dialogId);
            window.open(url);
          }
        }
      ]
    });	
  }  
 
 
  // show information in a smaller dialog  
  function showInfo( label, url ){		
   	 var jqModalContent = $('<iframe frameborder="0" style="margin: 0; padding: 0; height: 150px; width: 100%"></iframe>');
    // Open modal dialog and keep the dialog id
    var dialogId = ContentStationSdk.openModalDialog({
      title: label,
      width: 600,
      content: jqModalContent.attr('src', url ),
      contentNoPadding: true,
      buttons: [
        // Button defined as secondary with class 'pale'
        // Has no callback defined - will close the dialog.
        {
          label: 'Close',
          class: 'pale'
        },
        
      ]
    });	
  }  
  
  
  // we mis-use the dialog to load content, but close the dialog afterwards
  //
  function runSilent( label, url ){		
   	 var jqModalContent = $('<iframe frameborder="0" style="margin: 0; padding: 0; height: 150px; width: 100%"></iframe>');
    // Open modal dialog and keep the dialog id
    var dialogId = ContentStationSdk.openModalDialog({
      title: label,
      width: 600,
      content: jqModalContent.attr('src', url ),
      
    });	
    ContentStationSdk.closeModalDialog(dialogId);
  }  

})();