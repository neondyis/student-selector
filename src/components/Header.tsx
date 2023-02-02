import {Flex} from '@chakra-ui/react';
import {useCookies} from "react-cookie";

export default function Header () {
    const [cookies, setCookie] = useCookies();

    return(
        <header>
        </header>
    )
}