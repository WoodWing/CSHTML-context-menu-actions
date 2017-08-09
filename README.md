# CSHTML-context-menu-actions
Add Serverside scripts to Context Menu Actions for CS-HTML

 This script will help to convert old-style (CS9 and older) ContentStation ObjectContextMenuActions 
   to CS10 ContextActions
   
   
# Installation

create a folder ``<contentstation>/integrations``

add the script to this folder

open ``<contentstation>/config.js``

look for the setting `plugins`

add the line to the ``contentStation`` part of the arrayscript in the integrations folder 

```plugins: {
     contentStation: [
      //'sdk/samples/sample-1.js`',
      //'sdk/samples/sample-2.js',
       'integrations/ObjectContextMenuActions.js',
    ],
```


# Add menu actions from wwsettings   
   The old defintion for CS9 is located in wwsettings.xml, in the ObjectContextMenuActions section.
   the lines from that section can be converted to this defintion by making some small changes.
   
   A wwsetting.xml line looks like:
   ``<ObjectContextMenuAction label="printObjectAsHTML" url="{SERVER_URL}config/CS-scripts/printObjectAsHTML.php?ticket={SESSION_ID}&amp;ids={OBJECT_IDS}" objtypes="Layout" displayMode="external"/>``
		    
   replace:  ''``<ObjectContextMenuAction``'' with ``'{'``
   
   replace:  ending ``'/>'`` with ``'}'``
   
   replace: the ``'='`` behind each field with a ``':'``
  
   add a comma between each field
   
   replace ``&amp;`` with ``&``	
   
   the new line will then look like:
   
   ``{ label:"printObjectAsHTML", url:"{SERVER_URL}config/CS-scripts/printObjectAsHTML.php?ticket={SESSION_ID}&ids={OBJECT_IDS}", objtypes:"Layout" displayMode:"external" }``

you can now add this line to the 'actionlist' array. please add a comma after each line.

See sample in the script.
	
So the actionlist looks like lines with the following structure :

   { label: '' , url:'', objtypes:'' , displayMode:'', multiSelect : '', subMenu: ''}
   
where :

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

# Testing
the changes to config.js will be loaded dynamically. So refresh the contentStation web-page.

Then select an object that matches your menu definitions and press right-mouse-button to pop-up the action menu.

You defined menu entries should now be visable and you can select them.

# Disclaimer
This `ObjectContextMenuActions` script is intended to make an easy migration from CS9 to CS10/html.

The scripts being called on the server should still be installed and tested as seperate functionality. This readme does not explain how these scripts can be build.