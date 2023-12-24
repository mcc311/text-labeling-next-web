'use client';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

function MyBreadcrumbs() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const pathSegmentsMap: { [key: string]: string}= {
        'task': '任務列表',
        '': '首頁',
        'user': '使用者管理',
        'answer': '作答',
        'signUp': '註冊',
    }
    
    
    const [host, setHost] = useState('');

    useEffect(() => {
        // Now it's safe to use the window object
        setHost(window.location.host);
    }, []); // The empty array ensures this effect runs once after the initial render

    return (
        <Breadcrumbs>
            {pathSegments.map((segment, index) => (
                <BreadcrumbItem key={index} href={`http://${host}${pathSegments.slice(0, index + 1).join('/')}`}>
                    {pathSegmentsMap[segment] || decodeURIComponent(segment).replace(/-/g, ' ')}  
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );

}

export default MyBreadcrumbs;
