import Spinner from "@/app/components/ui/loading/spinner/sppiner";

const SplashScreen: React.FC = () => (
    <div className="splashScreen">
        <Spinner text="Carregando..." />
    </div>
);

export default SplashScreen;
