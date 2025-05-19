// main.nr

fn main(nome_hash: Field, expected_hash: pub Field) {
    // Validar se o nome processado (privado) bate com o hash publico
    assert(nome_hash == expected_hash);
}

#[test]
fn test_main() {
    // Sucesso: os dois hashes batem
    main(123456, 123456);

    // Falha: hashes diferentes
    // main(123456, 654321);
}