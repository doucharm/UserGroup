import { CreateDelayer } from "utils/Delayer"
import { useState, useCallback, useMemo } from "react"


/**
 * Editable Text (input type="text")
 * @param {*} id mandatory identification, often related to id of entity 
 * @param {str} value value of input
 * @param {str} placeholder value of help if the text is not displayed
 * @param {(value) => void} onChange delayed callback notifying about the change
 * @returns input with delayer in it
 */
export const TextInput = ({ id, value, onChange, placeholder }) => {
    const [localValue, setLocalValue] = useState(value)

    const delayer = useMemo(
        () => CreateDelayer(), [id]
    )

    const localOnChange = useCallback(
        (e) => {
            const newValue = e.target.value
            setLocalValue(newValue)
            if (onChange) {
                delayer(() => onChange(newValue))
            }
        }, [id, onChange]
    )

    return (
        <input className="form-control" placeholder={placeholder} value={localValue} onChange={localOnChange} />
    )
}

