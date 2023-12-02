# Plan
## Features
1. Column titles must stand out from the entries.
2. There should be a search bar that can filter on any property.
3. You should be able to edit or delete rows in place.(There is no expectation of persistence. Edit and delete are expected to only happen in memory.)
4. You need to implement pagination: Each page contains 10 rows. Buttons at the bottom allow you to jump to any page including special buttons for first page, previous page, next page and last page. Pagination must update based on search/filtering. If there are 25 records for example that match a search query, then pagination buttons should only go till 3.
5. You should be able to select one or more rows. A selected row is highlighted with a grayish background color. Multiple selected rows can be deleted at once using the 'Delete Selected' button at the bottom left.(This button is not available, send an email to the interviewer about the feature change)
6. Checkbox on the top left is a shortcut to select or deselect all displayed rows. This should only apply to the ten rows displayed in the current page, and not all 50 rows.
7. Search box placeholder text should start with Search.
8. Search icon/button should have class as search-icon OR trigger search on ENTER.
9. Action element must be a button with a specific class name like edit, delete, save.
10. Navigation elements must be a div/button, and should have class name as first-page, previous-page, next-page and last-page and page numbers should be mentioned accordingly.
11. Top right bin icon is bulk delete button. Disabled by default, enabled on bulk select. Add delete selected text in the button
12. On clicking edit action in a row, it should be editable in the row itself.
<!-- 13. Bottom delete button must have text Delete Selected. -->
14. feel free to use any libraries.
15. On executing, your application should be running successfully on deployed on vercel, netlify or any similar platform. 
16. after completing deployment. please submit [here](https://forms.gle/XAhSahQMFBayF6gq7).
    

## Workflow

- Make the table
  - get the data
  - create useState `data` and put the data fetched from the API 
  - create states to track pages
    - create a state for the `currentPage` -> initial value=1
  - create a state `filteredData`, initial value=`data`
  - make 5 columns
    - name
    - email
    - role
    - action
      - delete
        - call the delete function 
          - pass the id as an argument
          - delete the object matching the id from the state
      - edit
        - get an icon from internet 
        - call the edit function on click
          - take the row id as an argument
          - make isEditable true for the given id
      - checkbox
        - call the select function
          - pass the id as an argument
          - make isSelected true for the given id
    - Select all
      - call selectAll function
        - make isSelected true for all the rows in the current page
  - map data in the columns and render rows
    - derive a new state `visibleRows` from `filteredData` to show the current page
      - (currentPage-1)*10+1 = startingRow
      - filteredData.map(item=>startingRow < item.id < startingRow+9)
      - create a variable starting row, derive ending row
      - map the range of the rows in `visibleRows`
      - use this state to display the table 
    - if isEditable is true, render input else text
    - if isSelected is true, check the box. Also, highlight the row
    - if isSelected count > 0, enable the delete-all button
- pagination
  - show the current selected count out of total rows
  - show the current page out of total pages
    - if(totalRows%10>0){totalPages=totalRows/10+1} else{totalPages=totalRows/10}
  - show as many page numbers as the number of page count
    - call the changePage function
      - pass the page number as an argument 
      - change the current page state to the given argument
  - show action buttons
    - first page
      - call the changePage function and give arg=1
    - previous page
      - call the changePage function and give arg=currentPage-1
    - next page
      - call the changePage function and give arg=currentPage+1
    - last page 
      - call the changePage function and give arg=totalPages
- Search 
  - create an input
    - take value from user
  - create a search button
    - call the search function
    - pass input value as an argument
    - filter the data from `data` state matching the search value
    - change the `filteredData` state with the new data
  - 
data structure 
``` 
[{
  id: "integer",
  name: "string",
  email: "string",
  role: "string",
  isSelected: "boolean",
  isEditable: "boolean",
  isDeleted: "boolean"
}] 
``` 

