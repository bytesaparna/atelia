import React from 'react';
import { Loader } from '.././src/components/loader';

function Loading() {
    return (
        <div className='h-[90vh] flex items-center justify-center'>
            <div
                className="max-w-xl w-full"
            >
                <Loader text="ATELIA" automatic={true} />
            </div>
        </div>
    );
}

export default Loading
