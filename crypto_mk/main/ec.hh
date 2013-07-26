#pragma once

#include "pbc.h"
#include <main/prng.hh>

class ec_serializable {
public:
    std::string stringify(int truncate = 0) const;
    void to_bytes(void** output) const;
    static void from_bytes(void* ser, ec_serializable &output);
    element_ptr e;
};

class ec_scalar : public ec_serializable {
public:
    ec_scalar(const element_ptr & _e);
    ec_scalar();
    ~ec_scalar();

    ec_scalar operator/(const ec_scalar & s) const;
    void operator=(const ec_scalar & s);
};

class ec_point : public ec_serializable {
public:
    ec_point();
    ec_point(const element_ptr & _e);
    ~ec_point();

    ec_point operator^(const ec_scalar & s) const;
    void operator=(const ec_point & s);

    std::string pretty() const;
};


class EC {
public:
    EC();
    ~EC();

    void elem_init_G2(element_ptr e) const;
    void elem_init_Zr(element_ptr e) const;

    ec_point sample_G2() const;
    ec_scalar sample_scalar() const;
    
    ec_point hash(const std::string & s) const;

    ec_point pair(const ec_point & p1, const ec_point & p2) const;

    std::string xor_pattern (const ec_point & n);
    bool has_pattern(const std::string & tok, const std::string & ciph) const;

    static const int CTSIZE = 24;

private:
    pairing_ptr pairing;
    urandom u;

    static const int SEEDSIZE = 16;
};
