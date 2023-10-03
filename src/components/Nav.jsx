import styled from 'styled-components';
import { theme } from '../utils/theme';
import { useState } from 'react';

const Header = styled.nav`
    display: flex;
    color: ${theme.colors.white};
`;

export default function Nav() {
    const [menu, setMenu] = useState(false);

    return (
        <Header>
            { menu ?
                <button onClick={() => setMenu(false)}>Close</button>
                : null
            }
        </Header>
    )
}