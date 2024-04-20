import React from 'react'
import { Button } from "@chakra-ui/react";
const FallBack = () => {

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <>
            <div>
                Something went wrong
            </div>
            <div>Please try again later</div>
            <Button h="1.75rem" size="sm" onClick={handleReload}>
                Refresh page
            </Button>
        </>
    )
}

export default FallBack;