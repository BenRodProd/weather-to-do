import writeStyle from "@/service/writeStyle";
export default function ChooseStyling({user, setStyle}) {
    function handleStyleChange(e) {
     
        writeStyle(user, e.target.value);
        setStyle(e.target.value);
    }
    
    return (
        <>
        <div>ChooseStyling</div>
        
          
           <select onChange = {(e) => handleStyleChange(e)} id = "styling">
            <option value="modern">modern</option>
            <option value="manga">manga</option>
            <option value="animals">animals</option>
           </select>
            

        
        </>
    );
}