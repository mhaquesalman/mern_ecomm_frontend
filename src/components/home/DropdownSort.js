const DropdownSort = ({ sorts, handleSorts }) => {

    const handleOnChange = id => {
        // console.log('sort ', sorts[id].name)
        handleSorts(sorts[id].value)
    }

    return (
        <div className="col-3">
            <select id="sortlist" onChange={(e) => {
                handleOnChange(e.target.value)}}>
                 {sorts.map(sort => <option key={sort.id} value={sort.id}>{sort.name}</option>)}                  
            </select>
        </div>
    )
}

export default DropdownSort


// document.getElementById("sortlist").value