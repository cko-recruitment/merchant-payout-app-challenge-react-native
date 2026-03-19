import { useRouter } from 'expo-router';

export enum AppRoute {
    Home = 'Home',
    TransactionHistoryModal = 'TransactionModal',
    Cancel='Cancel',
}

export type AppRouteParams = {
    [AppRoute.Home]: undefined;
    [AppRoute.TransactionHistoryModal]: undefined;
    [AppRoute.Cancel]: undefined;
}

export function useCoordinator() {
    const router = useRouter();

    function navigateTo<T extends AppRoute>(route: AppRoute, params?: AppRouteParams) {
        switch (route) {
            case AppRoute.Home:
                router.push('/');
                break;

            case AppRoute.TransactionHistoryModal:
                router.push('/modal');
                break;
                
            case AppRoute.Cancel:
                router.dismiss();
                break;

            default:
                console.warn(`Unknown route: ${route}`);
                break;
        }
    }

    return { navigateTo };
}