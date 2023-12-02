import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [query, setQuery] = useState("");
  //derived state
  const selectedRows = filteredData.filter((row) => row.isSelected === true);
  let totalPages = 0;
  if (filteredData.length % 10 > 0) {
    totalPages = Math.ceil(filteredData.length / 10);
  } else {
    totalPages = filteredData.length / 10;
    if (totalPages === 0) {
      totalPages++;
    }
  }
  const buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <button key={i} onClick={() => handlePageChange(i)}>
        {i}
      </button>
    );
  }
  const startingRow = (currentPage - 1) * 10 + 1;
  let endingRow = startingRow + 9;
  let visibleRows = filteredData.filter(
    (row, index) => index + 1 >= startingRow && index + 1 <= endingRow
  );

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) =>
        setData(
          data.map((row) => ({
            ...row,
            isSelected: false,
            isEditable: false,
            isDeleted: false,
          }))
        )
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  function deleteRow(id) {
    const newData = filteredData.filter((row) => row.id != id);
    setFilteredData(newData);
  }

  function deleteRows() {
    const newData = filteredData.filter((row) => row.isSelected === false);
    setFilteredData(newData);
    // setAllRowsChecked(false);
  }

  function selectRow(id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          isSelected: !row.isSelected,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
    console.log(filteredData);
  }

  function selectAll() {
    const newData = filteredData.map((row, index) => {
      if (index + 1 >= startingRow && index + 1 <= endingRow) {
        return {
          ...row,
          isSelected: !row.isSelected,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }

  function editRow(id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          isEditable: !row.isEditable,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }
  function handleNameChange(e, id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          name: e.target.value,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }
  function handleEmailChange(e, id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          email: e.target.value,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }
  function handleRoleChange(e, id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          role: e.target.value,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }
  function saveRow(id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          isEditable: !row.isEditable,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }

  function search() {
    const newData =
      query.length > 0
        ? filteredData.filter(
            (row) =>
              row.name.toLowerCase().includes(query.toLowerCase()) ||
              row.email.toLowerCase().includes(query.toLowerCase()) ||
              row.role.toLowerCase().includes(query.toLowerCase())
          )
        : filteredData;
    setFilteredData(newData);
    setCurrentPage(1);
  }

  function handlePageChange(id) {
    setCurrentPage(id);
  }
  return (
    <div>
      <div className="top-box">
        <div>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
          <button type="submit" onClick={search}>
            Search
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={deleteRows}
            disabled={selectedRows.length === 0 ? true : false}
          >
            Delete selected
          </button>
        </div>
      </div>
      <div className="data-box">
        <input
          type="checkbox"
          onChange={selectAll}
          checked={
            visibleRows.length > 0 &&
            visibleRows.every((row) => row.isSelected === true)
          }
        ></input>
        <h3>Name</h3>
        <h3>Email</h3>
        <h3>Role</h3>
        <h3>Action</h3>
      </div>
      {visibleRows.length > 0 ? (
        visibleRows.map((row) => (
          <div className="data-box" key={row.id}>
            <input
              type="checkbox"
              onChange={() => selectRow(row.id)}
              checked={row.isSelected}
            ></input>
            {row.isEditable ? (
              <input
                placeholder="Enter Name"
                value={row.name}
                onChange={(e) => handleNameChange(e, row.id)}
              />
            ) : (
              <p>{row.name}</p>
            )}
            {row.isEditable ? (
              <input
                placeholder="Enter email"
                value={row.email}
                onChange={(e) => handleEmailChange(e, row.id)}
              />
            ) : (
              <p>{row.email}</p>
            )}
            {row.isEditable ? (
              <input
                placeholder="Enter role"
                value={row.role}
                onChange={(e) => handleRoleChange(e, row.id)}
              />
            ) : (
              <p>{row.role}</p>
            )}
            <div className="action-box">
              {row.isEditable ? (
                <button
                  type="button"
                  className="save-button"
                  onClick={() => saveRow(row.id)}
                >
                  <h4>Save</h4>
                </button>
              ) : (
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => editRow(row.id)}
                >
                  <h4>Edit</h4>
                </button>
              )}
              <button
                type="button"
                className="delete-button"
                onClick={() => deleteRow(row.id)}
              >
                <h4>Delete</h4>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No rows to display</div>
      )}
      <div className="footer">
        <div>
          <p>
            {selectedRows.length} out of {filteredData.length} rows selected
          </p>
        </div>
        <div className="page-component">
          <p>
            {currentPage} out of {totalPages} pages
          </p>
          <button
            type="button"
            className="first-page"
            onClick={() => handlePageChange(1)}
          >
            First
          </button>
          <button
            type="button"
            className="prev-page"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Prev
          </button>
          {buttons}
          <button
            type="button"
            className="next-page"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
          <button
            type="button"
            className="last-page"
            onClick={() => handlePageChange(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
