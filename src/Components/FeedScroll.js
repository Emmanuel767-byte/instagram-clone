import React from 'react'

function FeedScroll(props) {
    return (//IN-Line styling //SCROLLABLE COMPONENT
        <div style={{overflowY: 'scroll', border: '2px ridge lightblack', height:'fit-content'}}>
            {props.children}
        </div>
    )
}

export default FeedScroll
